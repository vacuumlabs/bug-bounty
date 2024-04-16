'use server'

import {eq} from 'drizzle-orm'

import {db} from '../db'
import {rewards} from '../db/schema/reward'
import {requireJudgeAuth} from '../utils/auth'

export const storeRewardTxHash = async ({
  rewardId,
  txHash,
}: {
  rewardId: string
  txHash: string
}) => {
  await requireJudgeAuth()

  const reward = await db.query.rewards.findFirst({
    where: (rewards, {eq}) => eq(rewards.id, rewardId),
  })

  if (!reward) {
    throw new Error('Reward not found.')
  }

  return db
    .update(rewards)
    .set({
      transferTxHash: txHash,
      payoutDate: new Date(),
    })
    .where(eq(rewards.id, rewardId))
    .returning()
}
