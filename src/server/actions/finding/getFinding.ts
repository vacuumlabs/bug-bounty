'use server'

import {and, count, eq, isNotNull, ne, sql} from 'drizzle-orm'

import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {PaginatedParams} from '@/lib/utils/common/pagination'
import {db} from '@/server/db'
import {
  FindingSeverity,
  FindingStatus,
  JudgeFindingStatus,
  UserRole,
} from '@/server/db/models'
import {findings} from '@/server/db/schema/finding'
import {
  isJudge,
  requireJudgeServerSession,
  requireServerSession,
} from '@/server/utils/auth'
import {deduplicatedFindings} from '@/server/db/schema/deduplicatedFinding'
import {sortByColumn, SortParams} from '@/lib/utils/common/sorting'
import {
  JudgeContestFindingSorting,
  JudgeFindingToDeduplicateSorting,
  SortDirection,
} from '@/lib/types/enums'

export type GetFindingParams = {
  findingId: string
}

export type Finding = Awaited<ReturnType<typeof getFindingAction>>

const getFindingAction = async ({findingId}: GetFindingParams) => {
  const session = await requireServerSession()

  const finding = await db.query.findings.findFirst({
    where: (findings, {eq}) => eq(findings.id, findingId),
    with: {
      findingAttachments: {
        columns: {
          attachmentUrl: true,
          fileName: true,
        },
      },
      deduplicatedFinding: {
        columns: {
          title: true,
          bestFindingId: true,
        },
      },
      author: {
        columns: {
          alias: true,
          id: true,
        },
      },
      contest: {
        columns: {
          repoUrl: true,
          authorId: true,
          status: true,
        },
      },
    },
  })

  if (!finding) {
    throw new ServerError('Finding not found.')
  }

  if (
    finding.contest.authorId !== session.user.id &&
    session.user.role !== UserRole.JUDGE
  ) {
    throw new ServerError('Unauthorized access to finding.')
  }

  return finding
}

export const getFinding = serializeServerErrors(getFindingAction)

export type GetFindingsParams = {
  deduplicatedFindingId: string
}

export type GetFindingsReturn = Awaited<ReturnType<typeof getFindingsAction>>

const getFindingsAction = async ({
  deduplicatedFindingId,
}: GetFindingsParams) => {
  const session = await requireServerSession()

  const deduplicatedFinding = await db.query.deduplicatedFindings.findFirst({
    with: {
      contest: {
        columns: {
          authorId: true,
        },
      },
    },
    where: (deduplicatedFindings, {eq}) =>
      eq(deduplicatedFindings.id, deduplicatedFindingId),
  })

  if (!deduplicatedFinding) {
    throw new ServerError('Deduplicated finding not found.')
  }

  if (
    deduplicatedFinding.contest.authorId !== session.user.id &&
    !isJudge(session)
  ) {
    throw new ServerError('Unauthorized access to findings.')
  }

  return db.query.findings.findMany({
    with: {
      author: {
        columns: {
          alias: true,
          id: true,
        },
      },
    },
    where: (findings, {eq}) =>
      eq(findings.deduplicatedFindingId, deduplicatedFindingId),
  })
}

export const getFindings = serializeServerErrors(getFindingsAction)

export type GetContestFindingsParams = PaginatedParams<
  {
    contestId: string
    status?: JudgeFindingStatus
  },
  SortParams<JudgeContestFindingSorting>
>

export type ContestFinding = Awaited<
  ReturnType<typeof getContestFindingsAction>
>['data'][number]

const getContestFindingsAction = async ({
  contestId,
  status,
  pageParams: {limit, offset = 0},
  sort = {
    field: JudgeContestFindingSorting.SEVERITY,
    direction: SortDirection.DESC,
  },
}: GetContestFindingsParams) => {
  await requireJudgeServerSession()

  const pendingCount =
    sql<number>`COUNT(*) FILTER (WHERE ${findings.status} = ${FindingStatus.PENDING})`
      .mapWith(Number)
      .as('pendingCount')

  const approvedCount =
    sql<number>`COUNT(*) FILTER (WHERE ${findings.status} = ${FindingStatus.APPROVED})`
      .mapWith(Number)
      .as('approvedCount')

  const rejectedCount =
    sql<number>`COUNT(*) FILTER (WHERE ${findings.status} = ${FindingStatus.REJECTED})`
      .mapWith(Number)
      .as('rejectedCount')

  const contestFindingsCountsQuery = db
    .select({
      pendingCount,
      approvedCount,
      rejectedCount,
    })
    .from(findings)
    .where(eq(findings.contestId, contestId))

  const getFindingStatus = () => {
    switch (status) {
      case JudgeFindingStatus.PENDING:
        return FindingStatus.PENDING
      case JudgeFindingStatus.APPROVED:
        return FindingStatus.APPROVED
      case JudgeFindingStatus.REJECTED:
        return FindingStatus.REJECTED
      default:
        return FindingStatus.PENDING
    }
  }

  const findingsCountSubquery = db
    .select({
      deduplicatedFindingId: findings.deduplicatedFindingId,
      count: count(findings.id).as('findingsCount'),
    })
    .from(findings)
    .groupBy(findings.deduplicatedFindingId)
    .as('findingsCountSubquery')

  const severitySort = sql<number>`
    CASE ${findings.severity}
      WHEN ${FindingSeverity.INFO} THEN 1
      WHEN ${FindingSeverity.LOW} THEN 2
      WHEN ${FindingSeverity.MEDIUM} THEN 3
      WHEN ${FindingSeverity.HIGH} THEN 4
      WHEN ${FindingSeverity.CRITICAL} THEN 5
      ELSE 6
    END`

  const sortFieldMap = {
    [JudgeContestFindingSorting.SEVERITY]: severitySort,
    [JudgeContestFindingSorting.TITLE]: findings.title,
    [JudgeContestFindingSorting.SUBMITTED]: findings.createdAt,
    [JudgeContestFindingSorting.DEDUPLICATED_FINDINGS]:
      findingsCountSubquery.count,
    [JudgeContestFindingSorting.DEDUPLICATED_TITLE]: deduplicatedFindings.title,
  }

  const contestFindingsQuery = db
    .select({
      id: findings.id,
      createdAt: findings.createdAt,
      deduplicatedFindingId: findings.deduplicatedFindingId,
      deduplicatedFindingTitle: deduplicatedFindings.title,
      contestId: findings.contestId,
      title: findings.title,
      severity: findings.severity,
      status: findings.status,
      deduplicatedFindingsCount: findingsCountSubquery.count,
      isBestFinding: sql<boolean>`EXISTS (SELECT 1 FROM ${deduplicatedFindings} WHERE ${deduplicatedFindings.bestFindingId} = ${findings.id})`,
    })
    .from(findings)
    .leftJoin(
      findingsCountSubquery,
      eq(
        findings.deduplicatedFindingId,
        findingsCountSubquery.deduplicatedFindingId,
      ),
    )
    .leftJoin(
      deduplicatedFindings,
      eq(deduplicatedFindings.id, findings.deduplicatedFindingId),
    )
    .where(
      and(
        eq(findings.contestId, contestId),
        status ? eq(findings.status, getFindingStatus()) : undefined,
      ),
    )
    .limit(limit)
    .offset(offset)
    .orderBy(sortByColumn(sort.direction, sortFieldMap[sort.field]))

  const [contestFindingsData, contestFindingsCounts] = await Promise.all([
    contestFindingsQuery,
    contestFindingsCountsQuery,
  ])

  if (!contestFindingsCounts[0]) {
    throw new ServerError('Failed to get judge contest findings counts.')
  }

  return {
    data: contestFindingsData,
    pageParams: {
      pendingCount: contestFindingsCounts[0].pendingCount,
      approvedCount: contestFindingsCounts[0].approvedCount,
      rejectedCount: contestFindingsCounts[0].rejectedCount,
    },
  }
}

export const getContestFindings = serializeServerErrors(
  getContestFindingsAction,
)

export type FindingToDeduplicate = Awaited<
  ReturnType<typeof getFindingsToDeduplicateAction>
>['data'][number]

export type GetFindingsToDeduplicateRequest = PaginatedParams<
  {
    deduplicatedFindingId: string
  },
  SortParams<JudgeFindingToDeduplicateSorting>
>

const getFindingsToDeduplicateAction = async ({
  deduplicatedFindingId,
  pageParams: {limit, offset = 0},
  sort = {
    field: JudgeFindingToDeduplicateSorting.SEVERITY,
    direction: SortDirection.ASC,
  },
}: GetFindingsToDeduplicateRequest) => {
  await requireJudgeServerSession()

  const deduplicatedFinding = await db.query.deduplicatedFindings.findFirst({
    where: (deduplicatedFindings, {eq}) =>
      eq(deduplicatedFindings.id, deduplicatedFindingId),
  })

  if (!deduplicatedFinding) {
    throw new ServerError('Deduplicated finding not found.')
  }

  const findingsCountSubquery = db
    .select({
      deduplicatedFindingId: findings.deduplicatedFindingId,
      count: count(findings.id).as('findingsCount'),
    })
    .from(findings)
    .groupBy(findings.deduplicatedFindingId)
    .as('findingsCountSubquery')

  const findingsToDeduplicateCountPromise = db
    .select({count: count()})
    .from(findings)
    .where(
      and(
        ne(findings.deduplicatedFindingId, deduplicatedFindingId),
        eq(findings.contestId, deduplicatedFinding.contestId),
        eq(findings.status, FindingStatus.APPROVED),
        isNotNull(findings.deduplicatedFindingId),
        eq(findingsCountSubquery.count, 1),
      ),
    )
    .leftJoin(
      findingsCountSubquery,
      eq(
        findings.deduplicatedFindingId,
        findingsCountSubquery.deduplicatedFindingId,
      ),
    )

  const severitySort = sql<number>`
    CASE ${findings.severity}
      WHEN ${FindingSeverity.INFO} THEN 1
      WHEN ${FindingSeverity.LOW} THEN 2
      WHEN ${FindingSeverity.MEDIUM} THEN 3
      WHEN ${FindingSeverity.HIGH} THEN 4
      WHEN ${FindingSeverity.CRITICAL} THEN 5
      ELSE 6
    END`

  const sortFieldMap = {
    [JudgeFindingToDeduplicateSorting.SEVERITY]: severitySort,
    [JudgeFindingToDeduplicateSorting.TITLE]: findings.title,
    [JudgeFindingToDeduplicateSorting.SUBMITTED]: findings.createdAt,
  }

  const findingsToDeduplicateQuery = db
    .select({
      id: findings.id,
      createdAt: findings.createdAt,
      deduplicatedFindingId: findings.deduplicatedFindingId,
      contestId: findings.contestId,
      title: findings.title,
      severity: findings.severity,
      status: findings.status,
      deduplicatedFindingsCount: findingsCountSubquery.count,
      isBestFinding: sql<boolean>`EXISTS (SELECT 1 FROM ${deduplicatedFindings} WHERE ${deduplicatedFindings.bestFindingId} = ${findings.id})`,
    })
    .from(findings)
    .leftJoin(
      findingsCountSubquery,
      eq(
        findings.deduplicatedFindingId,
        findingsCountSubquery.deduplicatedFindingId,
      ),
    )
    .where(
      and(
        ne(findings.deduplicatedFindingId, deduplicatedFindingId),
        eq(findings.contestId, deduplicatedFinding.contestId),
        eq(findings.status, FindingStatus.APPROVED),
        isNotNull(findings.deduplicatedFindingId),
        eq(findingsCountSubquery.count, 1),
      ),
    )
    .limit(limit)
    .offset(offset)
    .orderBy(sortByColumn(sort.direction, sortFieldMap[sort.field]))

  const [findingsToDeduplicate, findingsToDeduplicateCount] = await Promise.all(
    [findingsToDeduplicateQuery, findingsToDeduplicateCountPromise],
  )

  if (!findingsToDeduplicateCount[0]) {
    throw new ServerError('Failed to get judge contest findings counts.')
  }

  return {
    data: findingsToDeduplicate,
    pageParams: {totalCount: findingsToDeduplicateCount[0].count},
  }
}

export const getFindingsToDeduplicate = serializeServerErrors(
  getFindingsToDeduplicateAction,
)
