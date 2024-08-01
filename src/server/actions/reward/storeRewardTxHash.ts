'use server'

import {and, eq, isNull} from 'drizzle-orm'
import {z} from 'zod'

import {db} from '../../db'
import {rewards} from '../../db/schema/reward'
import {requireJudgeServerSession} from '../../utils/auth'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {ServerError} from '@/lib/types/error'
import {findings} from '@/server/db/schema/finding'
import {contests} from '@/server/db/schema/contest'

const storeRewardTxHashSchema = z.object({
  contestId: z.string().uuid(),
  userId: z.string().uuid(),
  txHash: z.string().min(1),
})

type StoreRewardTxHashRequest = z.infer<typeof storeRewardTxHashSchema>

export const storeRewardTxHashAction = async (
  request: StoreRewardTxHashRequest,
) => {
  await requireJudgeServerSession()
  const {contestId, userId, txHash} = storeRewardTxHashSchema.parse(request)

  const reward = await db
    .select({
      userId: rewards.userId,
    })
    .from(rewards)
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .groupBy(rewards.userId)
    .where(
      and(
        eq(contests.id, contestId),
        eq(rewards.userId, userId),
        isNull(rewards.transferTxHash),
      ),
    )

  if (reward.length === 0) {
    throw new ServerError('Reward not found')
  }

  return db
    .update(rewards)
    .set({
      transferTxHash: txHash,
      payoutDate: new Date(),
    })
    .where(
      and(
        eq(contests.id, contestId),
        eq(rewards.userId, userId),
        isNull(rewards.transferTxHash),
      ),
    )
    .returning()
}

export const storeRewardTxHash = serializeServerErrors(storeRewardTxHashAction)
