'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeAuth} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {ServerError} from '@/lib/types/error'

const approveOrRejectContestSchema = z
  .object({
    contestId: z.string().uuid(),
    newStatus: z.enum([
      ContestStatus.APPROVED,
      ContestStatus.REJECTED,
      ContestStatus.PENDING,
    ]),
  })
  .strict()

export type ApproveOrRejectContestRequest = z.infer<
  typeof approveOrRejectContestSchema
>

export const approveOrRejectContestAction = async (
  request: ApproveOrRejectContestRequest,
) => {
  await requireJudgeAuth()

  const {contestId, newStatus} = approveOrRejectContestSchema.parse(request)

  const contest = await db.query.contests.findFirst({
    columns: {status: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new ServerError('Contest not found.')
  }

  if (
    contest.status !== ContestStatus.PENDING &&
    contest.status !== ContestStatus.IN_REVIEW
  ) {
    throw new ServerError(
      'Only pending and in review contests can be approved/rejected.',
    )
  }

  return db
    .update(schema.contests)
    .set({status: newStatus})
    .where(eq(schema.contests.id, contestId))
    .returning()
}

export const approveOrRejectContest = serializeServerErrors(
  approveOrRejectContestAction,
)
