'use server'

import {count, countDistinct, eq, sql} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {requireServerSession} from '@/server/utils/auth'
import {deduplicatedFindings} from '@/server/db/schema/deduplicatedFinding'
import {ServerError} from '@/lib/types/error'
import {findings} from '@/server/db/schema/finding'
import {MyProjectVulnerabilitiesSorting, SortDirection} from '@/lib/types/enums'
import {SortParams, sortByColumn} from '@/lib/utils/common/sorting'
import {ContestStatus, FindingSeverity} from '@/server/db/models'
import {PaginatedParams} from '@/lib/utils/common/pagination'

const getDeduplicatedFindingAction = async (deduplicatedFindingId: string) => {
  const session = await requireServerSession()

  const deduplicatedFinding = await db.query.deduplicatedFindings.findFirst({
    with: {
      contest: {
        columns: {
          authorId: true,
          title: true,
          status: true,
        },
      },
    },
    where: (deduplicatedFindings, {eq}) =>
      eq(deduplicatedFindings.id, deduplicatedFindingId),
  })

  if (deduplicatedFinding?.contest.authorId !== session.user.id) {
    throw new ServerError('Unauthorized access to deduplicated finding.')
  }

  if (deduplicatedFinding.contest.status !== ContestStatus.FINISHED) {
    throw new ServerError('Contest is not finished.')
  }

  const findingCounts = await db
    .select({count: count()})
    .from(findings)
    .where(eq(findings.deduplicatedFindingId, deduplicatedFindingId))

  return {
    ...deduplicatedFinding,
    findingsCount: findingCounts[0]?.count ?? 0,
  }
}

export const getDeduplicatedFinding = serializeServerErrors(
  getDeduplicatedFindingAction,
)

export type GetDeduplicatedFindingsParams = PaginatedParams<
  {
    contestId: string
  },
  SortParams<MyProjectVulnerabilitiesSorting>
>

export const getDeduplicatedFindingsAction = async ({
  contestId,
  pageParams: {limit, offset = 0},
  sort = {
    field: MyProjectVulnerabilitiesSorting.SEVERITY,
    direction: SortDirection.DESC,
  },
}: GetDeduplicatedFindingsParams) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {
      authorId: true,
      status: true,
    },
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (contest?.authorId !== session.user.id) {
    throw new ServerError('Unauthorized access to contest.')
  }

  if (contest.status !== ContestStatus.FINISHED) {
    throw new ServerError('Contest is not finished.')
  }

  const findingsCount = countDistinct(findings.id).as('findingsCount')

  const severitySort = sql<number>`
  CASE ${deduplicatedFindings.severity}
    WHEN ${FindingSeverity.INFO} THEN 1
    WHEN ${FindingSeverity.LOW} THEN 2
    WHEN ${FindingSeverity.MEDIUM} THEN 3
    WHEN ${FindingSeverity.HIGH} THEN 4
    WHEN ${FindingSeverity.CRITICAL} THEN 5
    ELSE 6
  END`

  const sortFieldMap = {
    [MyProjectVulnerabilitiesSorting.SEVERITY]: severitySort,
    [MyProjectVulnerabilitiesSorting.FOUND_BY]: findingsCount,
    [MyProjectVulnerabilitiesSorting.VULNERABILITY]: deduplicatedFindings.title,
  }

  return db
    .select({
      id: deduplicatedFindings.id,
      title: deduplicatedFindings.title,
      severity: deduplicatedFindings.severity,
      bestFindingId: deduplicatedFindings.bestFindingId,
      findingsCount: findingsCount,
    })
    .from(deduplicatedFindings)
    .where(eq(deduplicatedFindings.contestId, contestId))
    .leftJoin(
      findings,
      eq(findings.deduplicatedFindingId, deduplicatedFindings.id),
    )
    .groupBy(deduplicatedFindings.id)
    .orderBy(sortByColumn(sort.direction, sortFieldMap[sort.field]))
    .limit(limit)
    .offset(offset)
}

export const getDeduplicatedFindings = serializeServerErrors(
  getDeduplicatedFindingsAction,
)

const getDeduplicatedFindingsCountAction = async (contestId: string) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {
      authorId: true,
      status: true,
    },
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (contest?.authorId !== session.user.id) {
    throw new ServerError('Unauthorized access to contest.')
  }

  if (contest.status !== ContestStatus.FINISHED) {
    throw new ServerError('Contest is not finished.')
  }

  const deduplicatedFindingsCount = await db
    .select({
      count: count(),
    })
    .from(deduplicatedFindings)
    .where(eq(deduplicatedFindings.contestId, contestId))

  if (!deduplicatedFindingsCount[0]) {
    throw new ServerError('Failed to get deduplicated findings total size.')
  }

  return {count: deduplicatedFindingsCount[0].count}
}

export const getDeduplicatedFindingsCount = serializeServerErrors(
  getDeduplicatedFindingsCountAction,
)
