'use server'

import {db} from '../../db'

export const getReward = async (id: string) => {
  const reward = await db.query.rewards.findFirst({
    where: (reward, {eq}) => eq(reward.id, id),
  })

  if (!reward) {
    throw new Error('Reward not found')
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
    throw new Error('Reward not found')
  }

  return {
    amount: reward.amount,
    transferTxHash: reward.transferTxHash,
    walletAddress: reward.user.walletAddress,
  }
}

export type GetRewardsParams = {
  findingId?: string
  userId?: string
  status?: 'paid' | 'unpaid'
  limit: number
  offset?: number
}

export type RewardWithUser = Awaited<ReturnType<typeof getRewards>>[number]

export const getRewards = async ({
  findingId,
  userId,
  status,
  limit,
  offset = 0,
}: GetRewardsParams) => {
  return db.query.rewards.findMany({
    limit,
    offset,
    where: (rewards, {and, eq, isNotNull, isNull}) =>
      and(
        findingId ? eq(rewards.findingId, findingId) : undefined,
        userId ? eq(rewards.userId, userId) : undefined,
        status === 'paid' ? isNotNull(rewards.transferTxHash) : undefined,
        status === 'unpaid' ? isNull(rewards.transferTxHash) : undefined,
      ),
    orderBy: (rewards, {desc}) => desc(rewards.createdAt),
    with: {
      user: {
        columns: {
          name: true,
          image: true,
          walletAddress: true,
        },
      },
    },
  })
}
