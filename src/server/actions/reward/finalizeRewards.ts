'use server'

import {eq} from 'drizzle-orm'

import {calculateRewards} from './calculateRewards'

import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeAuth} from '@/server/utils/auth'

export type FinalizeRewardsResponse = Awaited<
  ReturnType<typeof finalizeRewards>
>

export const finalizeRewards = async (contestId: string) => {
  await requireJudgeAuth()

  const {rewards, totalRewards} = await calculateRewards(contestId)

  return db.transaction(async (tx) => {
    await tx
      .update(schema.contests)
      .set({
        status: ContestStatus.FINISHED,
        distributedRewardsAmount: totalRewards.toFixed(0),
      })
      .where(eq(schema.contests.id, contestId))

    return tx.insert(schema.rewards).values(rewards).returning()
  })
}
