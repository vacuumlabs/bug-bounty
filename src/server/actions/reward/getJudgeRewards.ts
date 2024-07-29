'use server'

import {and, count, eq, isNotNull} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {PaginatedParams} from '@/lib/utils/common/pagination'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'
import {
  judgeRewardSortFieldMap,
  sortByColumn,
  SortParams,
} from '@/lib/utils/common/sorting'
import {JudgeRewardSorting, SortDirection} from '@/lib/types/enums'

export type GetJudgeRewardsParams = PaginatedParams<
  object,
  SortParams<JudgeRewardSorting>
>

export type JudgeReward = Awaited<
  ReturnType<typeof getJudgeRewardsAction>
>['data'][number]

export const getJudgeRewardsAction = async ({
  pageParams: {limit, offset = 0},
  sort = {
    direction: SortDirection.DESC,
    field: JudgeRewardSorting.END_DATE,
  },
}: GetJudgeRewardsParams) => {
  await requireJudgeServerSession()

  const countQuery = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        eq(contests.status, ContestStatus.FINISHED),
        isNotNull(contests.distributedRewardsAmount),
      ),
    )

  const rewardsQuery = db.query.contests.findMany({
    where: (contests, {eq, and, isNotNull}) =>
      and(
        eq(contests.status, ContestStatus.FINISHED),
        isNotNull(contests.distributedRewardsAmount),
      ),
    limit,
    offset,
    orderBy: sortByColumn(sort.direction, judgeRewardSortFieldMap[sort.field]),
  })

  const [rewards, rewardsCount] = await Promise.all([rewardsQuery, countQuery])

  if (!rewardsCount[0]) {
    throw new ServerError('Failed to get judge rewards count.')
  }

  return {
    data: rewards,
    pageParams: {
      totalCount: rewardsCount[0].count,
    },
  }
}

export const getJudgeRewards = serializeServerErrors(getJudgeRewardsAction)
