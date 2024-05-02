'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db} from '../../db'
import {rewards} from '../../db/schema/reward'
import {requireJudgeAuth} from '../../utils/auth'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {ServerError} from '@/lib/types/error'

const storeRewardTxHashSchema = z.object({
  rewardId: z.string().uuid(),
  txHash: z.string().min(1),
})

type StoreRewardTxHashRequest = z.infer<typeof storeRewardTxHashSchema>

export const storeRewardTxHashAction = async (
  request: StoreRewardTxHashRequest,
) => {
  await requireJudgeAuth()
  const {rewardId, txHash} = storeRewardTxHashSchema.parse(request)

  const reward = await db.query.rewards.findFirst({
    where: (rewards, {eq}) => eq(rewards.id, rewardId),
  })

  if (!reward) {
    throw new ServerError('Reward not found.')
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

export const storeRewardTxHash = serializeServerErrors(storeRewardTxHashAction)
