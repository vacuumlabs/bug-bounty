'use server'

import {eq, count} from 'drizzle-orm'

import {db} from '@/server/db'
import {rewards} from '@/server/db/schema/reward'
import {requireServerSession} from '@/server/utils/auth'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {
  SortParams,
  myFindingsRewardsSortFieldMap,
  sortByColumn,
} from '@/lib/utils/common/sorting'
import {MyFindingsRewardsSorting, SortDirection} from '@/lib/types/enums'
import {findings} from '@/server/db/schema/finding'
import {contests} from '@/server/db/schema/contest'
import {PaginatedParams} from '@/lib/utils/common/pagination'

export type MyFindingsReward = Awaited<
  ReturnType<typeof getMyFindingsRewardsAction>
>['data'][number]

export type GetMyFindingsRewardsParams = PaginatedParams<
  undefined,
  SortParams<MyFindingsRewardsSorting>
>

const getMyFindingsRewardsAction = async ({
  pageParams: {limit, offset = 0},
  sort = {
    field: MyFindingsRewardsSorting.SUBMITTED,
    direction: SortDirection.DESC,
  },
}: GetMyFindingsRewardsParams) => {
  const session = await requireServerSession()

  const myFindingsRewardsQuery = db
    .select({
      reward: {
        id: rewards.id,
        amount: rewards.amount,
        transferTxHash: rewards.transferTxHash,
      },
      finding: {
        severity: findings.severity,
        updatedAt: findings.updatedAt,
        createdAt: findings.createdAt,
      },
      contest: {
        title: contests.title,
      },
    })
    .from(rewards)
    .where(eq(rewards.userId, session.user.id))
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .orderBy(
      sortByColumn(sort.direction, myFindingsRewardsSortFieldMap[sort.field]),
    )
    .limit(limit)
    .offset(offset)

  const myFindingsRewardsCountQuery = db
    .select({
      count: count(),
    })
    .from(rewards)
    .where(eq(rewards.userId, session.user.id))

  const [myFindingsRewards, myFindingsRewardsCount] = await Promise.all([
    myFindingsRewardsQuery,
    myFindingsRewardsCountQuery,
  ])

  if (!myFindingsRewardsCount[0]) {
    throw new ServerError('Failed to get rewards total size.')
  }

  return {
    data: myFindingsRewards,
    pageParams: {totalCount: myFindingsRewardsCount[0].count},
  }
}

export const getMyFindingsRewards = serializeServerErrors(
  getMyFindingsRewardsAction,
)
