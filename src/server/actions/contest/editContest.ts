'use server'

import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/schema/contest'
import {requireJudgeAuth} from '@/server/utils/auth'

export type ConfirmOrRejectContestParams = {
  contestId: string
  newStatus: ContestStatus.APPROVED | ContestStatus.REJECTED
}

export const confirmOrRejectContest = async ({
  contestId,
  newStatus,
}: ConfirmOrRejectContestParams) => {
  await requireJudgeAuth()

  const contest = await db.query.contests.findFirst({
    columns: {status: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new Error('Contest not found.')
  }

  if (contest.status !== ContestStatus.PENDING) {
    throw new Error('Only pending contests can be confirmed/rejected.')
  }

  return db
    .update(schema.contests)
    .set({status: newStatus})
    .where(eq(schema.contests.id, contestId))
    .returning()
}
