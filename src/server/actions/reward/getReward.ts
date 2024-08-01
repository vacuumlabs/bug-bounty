'use server'
import {and, countDistinct, eq, isNull, sql, sum} from 'drizzle-orm'

import {db} from '../../db'

import {serializeServerErrors} from '@/lib/utils/common/error'
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

export const getRewardAction = async (id: string) => {
  const reward = await db.query.rewards.findFirst({
    where: (reward, {eq}) => eq(reward.id, id),
  })

  if (!reward) {
    throw new ServerError('Reward not found')
  }

  return reward
}

export const getReward = serializeServerErrors(getRewardAction)

export const getRewardPaymentDetailsAction = async (
  contestId: string,
  userId: string,
) => {
  const reward = await db
    .select({
      amount: sum(rewards.amount),
      userWalletAddress: users.walletAddress,
    })
    .from(rewards)
    .leftJoin(users, eq(rewards.userId, users.id))
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .groupBy(users.id)
    .where(
      and(
        eq(rewards.userId, userId),
        isNull(rewards.transferTxHash),
        eq(contests.id, contestId),
      ),
    )

  const userReward = reward[0]

  if (!userReward) {
    throw new ServerError('Reward not found')
  }

  if (!userReward.amount) {
    throw new ServerError('Reward amount not found')
  }

  return {
    amount: userReward.amount,
    walletAddress: userReward.userWalletAddress,
  }
}

export const getRewardPaymentDetails = serializeServerErrors(
  getRewardPaymentDetailsAction,
)

export type GetRewardsPayoutParams = PaginatedParams<
  {
    contestId: string
  },
  SortParams<JudgePayoutRewardSorting>
>

export type RewardsPayout = Awaited<
  ReturnType<typeof getRewardsPayoutAction>
>['data'][number]

type RewardDetail = {
  transferTxHash: string
  payoutDate: Date | null
  contest: {
    id: string
    title: string
  }
}

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
      count: countDistinct(rewards.userId),
    })
    .from(rewards)
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(eq(contests.id, contestId))

  const rewardsPayoutQuery = db
    .select({
      totalAmount: sum(rewards.amount).as('totalAmount'),
      rewardDetails: sql<RewardDetail[]>`json_agg(json_build_object(
        'transferTxHash', ${rewards.transferTxHash},
        'payoutDate', ${rewards.payoutDate},
        'contest', json_build_object(
          'id', ${contests.id},
          'title', ${contests.title}
        )
      ))`.as('rewardDetails'),
      user: {
        id: users.id,
        name: users.name,
        walletAddress: users.walletAddress,
        alias: users.alias,
        email: users.email,
      },
    })
    .from(rewards)
    .leftJoin(users, eq(rewards.userId, users.id))
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(eq(contests.id, contestId))
    .groupBy(
      users.id,
      users.name,
      users.walletAddress,
      users.alias,
      users.email,
    )
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
