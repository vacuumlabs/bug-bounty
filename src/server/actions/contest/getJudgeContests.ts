'use server'

import {inArray, ne, sql} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {
  ContestOccurence,
  ContestStatus,
  FindingStatus,
} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {PaginatedParams} from '@/lib/utils/common/pagination'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'
import {
  judgeContestSortFieldMap,
  sortByColumn,
  SortParams,
} from '@/lib/utils/common/sorting'
import {JudgeContestSorting, SortDirection} from '@/lib/types/enums'

export type GetJudgeContestsParams = PaginatedParams<
  {
    type?: ContestOccurence
    status?: ContestStatus[]
  },
  SortParams<JudgeContestSorting>
>

export type JudgeContest = Awaited<
  ReturnType<typeof getJudgeContestsAction>
>['data'][number]

export const getJudgeContestsAction = async ({
  type,
  status,
  pageParams: {limit, offset = 0},
  sort = {
    direction: SortDirection.DESC,
    field: JudgeContestSorting.STATUS,
  },
}: GetJudgeContestsParams) => {
  await requireJudgeServerSession()

  const pastCount =
    sql<number>`COUNT(*) FILTER (WHERE ${contests.endDate} < NOW())`
      .mapWith(Number)
      .as('pastCount')

  const presentCount =
    sql<number>`COUNT(*) FILTER (WHERE ${contests.startDate} <= NOW() AND ${contests.endDate} >= NOW())`
      .mapWith(Number)
      .as('presentCount')

  const futureCount =
    sql<number>`COUNT(*) FILTER (WHERE ${contests.startDate} > NOW())`
      .mapWith(Number)
      .as('futureCount')

  const contestCountsQuery = db
    .select({
      pastCount,
      presentCount,
      futureCount,
    })
    .from(contests)

  const contestsQuery = db.query.contests.findMany({
    where: (contests, {and, gte, lte}) =>
      and(
        type === ContestOccurence.PAST
          ? lte(contests.endDate, new Date())
          : undefined,
        type === ContestOccurence.PRESENT
          ? and(
              lte(contests.startDate, new Date()),
              gte(contests.endDate, new Date()),
            )
          : undefined,
        type === ContestOccurence.FUTURE
          ? gte(contests.startDate, new Date())
          : undefined,
        status && status.length > 0
          ? inArray(contests.status, status)
          : undefined,
        ne(contests.status, ContestStatus.DRAFT),
      ),
    extras: {
      pendingFindingsCount:
        sql<number>`(SELECT count(*)::int from finding where finding.status = ${FindingStatus.PENDING} and "finding"."contestId" = contests.id)`.as(
          'pendingFindingsCount',
        ),
      approvedFindingsCount:
        sql<number>`(SELECT count(*)::int from finding where finding.status = ${FindingStatus.APPROVED} and "finding"."contestId" = contests.id)`.as(
          'approvedFindingsCount',
        ),
      rejectedFindingsCount:
        sql<number>`(SELECT count(*)::int from finding where finding.status = ${FindingStatus.REJECTED} and "finding"."contestId" = contests.id)`.as(
          'rejectedFindingsCount',
        ),
      rewardedAuditorsCount:
        sql<number>`(SELECT count(distinct "finding"."authorId")::int from finding where finding.status = ${FindingStatus.APPROVED} and "finding"."contestId" = contests.id)`.as(
          'rewardedAuditorsCount',
        ),
    },
    limit,
    offset,
    orderBy: sortByColumn(sort.direction, judgeContestSortFieldMap[sort.field]),
  })

  const [contestsData, contestCounts] = await Promise.all([
    contestsQuery,
    contestCountsQuery,
  ])

  if (!contestCounts[0]) {
    throw new ServerError('Failed to get judge contests total size.')
  }

  return {
    data: contestsData,
    pageParams: {
      liveCount: contestCounts[0].presentCount,
      pastCount: contestCounts[0].pastCount,
      futureCount: contestCounts[0].futureCount,
    },
  }
}

export const getJudgeContests = serializeServerErrors(getJudgeContestsAction)
