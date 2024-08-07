'use server'

import {eq} from 'drizzle-orm'

import {calculateRewardsAction} from './calculateRewards'

import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'

export type FinalizeRewardsResponse = Awaited<
  ReturnType<typeof finalizeRewards>
>

export const finalizeRewardsAction = async (contestId: string) => {
  await requireJudgeServerSession()

  const {totalRewards, rewards} = await calculateRewardsAction(contestId)

  return db.transaction(async (tx) => {
    await tx
      .update(schema.contests)
      .set({
        status: ContestStatus.FINISHED,
        distributedRewardsAmount: totalRewards.toFixed(0),
      })
      .where(eq(schema.contests.id, contestId))

    return rewards.length === 0
      ? []
      : tx.insert(schema.rewards).values(rewards).returning()
  })
}

export const finalizeRewards = serializeServerErrors(finalizeRewardsAction)
