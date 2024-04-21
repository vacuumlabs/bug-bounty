'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db} from '../../db'
import {rewards} from '../../db/schema/reward'
import {requireJudgeAuth} from '../../utils/auth'

const storeRewardTxHashSchema = z.object({
  rewardId: z.string(),
  txHash: z.string(),
})

type StoreRewardTxHashParams = z.infer<typeof storeRewardTxHashSchema>

export const storeRewardTxHash = async (params: StoreRewardTxHashParams) => {
  await requireJudgeAuth()

  const {rewardId, txHash} = storeRewardTxHashSchema.parse(params)

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
