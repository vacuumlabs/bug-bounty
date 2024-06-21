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

export type MyFindingsReward = Awaited<
  ReturnType<typeof getMyFindingsRewardsAction>
>[number]

export type GetMyFindingsRewardsParams = {
  limit: number
  offset?: number
  sort?: SortParams<MyFindingsRewardsSorting>
}

const getMyFindingsRewardsAction = async ({
  limit,
  offset = 0,
  sort = {
    field: MyFindingsRewardsSorting.SUBMITTED,
    direction: SortDirection.DESC,
  },
}: GetMyFindingsRewardsParams) => {
  const session = await requireServerSession()

  return db
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
}

export const getMyFindingsRewards = serializeServerErrors(
  getMyFindingsRewardsAction,
)

const getMyFindingsRewardsCountAction = async () => {
  const session = await requireServerSession()

  const rewardsCount = await db
    .select({
      count: count(),
    })
    .from(rewards)
    .where(eq(rewards.userId, session.user.id))

  if (!rewardsCount[0]) {
    throw new ServerError('Failed to get rewards total size.')
  }

  return {count: rewardsCount[0].count}
}

export const getMyFindingsRewardsCount = serializeServerErrors(
  getMyFindingsRewardsCountAction,
)
