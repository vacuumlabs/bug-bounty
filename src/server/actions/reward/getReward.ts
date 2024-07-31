'use server'
import {count, eq} from 'drizzle-orm'

import {db} from '../../db'

import {getApiError, serializeServerErrors} from '@/lib/utils/common/error'
import {rewards} from '@/server/db/schema/reward'
import {findings} from '@/server/db/schema/finding'
import {contests} from '@/server/db/schema/contest'
import {users} from '@/server/db/schema/user'
import {PaginatedParams} from '@/lib/utils/common/pagination'
import {ServerError} from '@/lib/types/error'
import {
  judgeRewardPayoutSortFieldMap,
  sortByColumn,
  SortParams,
} from '@/lib/utils/common/sorting'
import {JudgePayoutRewardSorting, SortDirection} from '@/lib/types/enums'

export const getReward = async (id: string) => {
  const reward = await db.query.rewards.findFirst({
    where: (reward, {eq}) => eq(reward.id, id),
  })

  if (!reward) {
    return getApiError('Reward not found')
  }

  return reward
}

export const getRewardPaymentDetails = async (id: string) => {
  const reward = await db.query.rewards.findFirst({
    where: (reward, {eq}) => eq(reward.id, id),
    columns: {
      amount: true,
      transferTxHash: true,
    },
    with: {
      user: {
        columns: {
          walletAddress: true,
        },
      },
    },
  })

  if (!reward) {
    return getApiError('Reward not found')
  }

  return {
    amount: reward.amount,
    transferTxHash: reward.transferTxHash,
    walletAddress: reward.user.walletAddress,
  }
}

export type GetRewardsPayoutParams = PaginatedParams<
  {
    contestId: string
  },
  SortParams<JudgePayoutRewardSorting>
>

export type RewardsPayout = Awaited<
  ReturnType<typeof getRewardsPayoutAction>
>['data'][number]

const getRewardsPayoutAction = async ({
  contestId,
  pageParams: {limit, offset = 0},
  sort = {
    field: JudgePayoutRewardSorting.AMOUNT,
    direction: SortDirection.DESC,
  },
}: GetRewardsPayoutParams) => {
  const rewardsPayoutCountQuery = db
    .select({
      count: count(),
    })
    .from(rewards)
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(eq(contests.id, contestId))

  const rewardsPayoutQuery = db
    .select({
      id: rewards.id,
      amount: rewards.amount,
      transferTxHash: rewards.transferTxHash,
      payoutDate: rewards.payoutDate,
      user: {
        name: users.name,
        walletAddress: users.walletAddress,
        alias: users.alias,
        email: users.email,
      },
      contest: {
        id: contests.id,
        title: contests.title,
      },
    })
    .from(rewards)
    .leftJoin(users, eq(rewards.userId, users.id))
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(eq(contests.id, contestId))
    .limit(limit)
    .offset(offset)
    .orderBy(
      sortByColumn(sort.direction, judgeRewardPayoutSortFieldMap[sort.field]),
    )

  const [rewardsPayout, rewardsPayoutCount] = await Promise.all([
    rewardsPayoutQuery,
    rewardsPayoutCountQuery,
  ])

  if (!rewardsPayoutCount[0]) {
    throw new ServerError('Rewards payout count not found.')
  }

  return {
    data: rewardsPayout,
    pageParams: {
      totalCount: rewardsPayoutCount[0].count,
    },
  }
}

export const getRewardsPayout = serializeServerErrors(getRewardsPayoutAction)
