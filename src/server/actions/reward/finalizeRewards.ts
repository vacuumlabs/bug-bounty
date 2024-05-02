'use server'

import {eq} from 'drizzle-orm'

import {calculateRewardsAction} from './calculateRewards'

import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeAuth} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'

export type FinalizeRewardsResponse = Awaited<
  ReturnType<typeof finalizeRewards>
>

const finalizeRewardsAction = async (contestId: string) => {
  await requireJudgeAuth()

  const {totalRewards, rewards} = await calculateRewardsAction(contestId)

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

export const finalizeRewards = serializeServerErrors(finalizeRewardsAction)
