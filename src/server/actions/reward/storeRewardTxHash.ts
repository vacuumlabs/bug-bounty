'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db} from '../../db'
import {rewards} from '../../db/schema/reward'
import {requireJudgeAuth} from '../../utils/auth'

import {getApiZodError} from '@/lib/utils/common/error'

const storeRewardTxHashSchema = z.object({
  rewardId: z.string(),
  txHash: z.string(),
})

type StoreRewardTxHashRequest = z.infer<typeof storeRewardTxHashSchema>

export const storeRewardTxHash = async (request: StoreRewardTxHashRequest) => {
  await requireJudgeAuth()
  const result = storeRewardTxHashSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {rewardId, txHash} = result.data

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
