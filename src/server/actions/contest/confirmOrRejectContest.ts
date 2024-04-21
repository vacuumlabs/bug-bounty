'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeAuth} from '@/server/utils/auth'

const confirmOrRejectContestSchema = z
  .object({
    contestId: z.string(),
    newStatus: z.enum([ContestStatus.APPROVED, ContestStatus.REJECTED]),
  })
  .strict()

export type ConfirmOrRejectContestParams = z.infer<
  typeof confirmOrRejectContestSchema
>

export const confirmOrRejectContest = async (
  params: ConfirmOrRejectContestParams,
) => {
  await requireJudgeAuth()

  const {contestId, newStatus} = confirmOrRejectContestSchema.parse(params)

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
