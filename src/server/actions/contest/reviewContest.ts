'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {ServerError} from '@/lib/types/error'
import {rewardsTransferAddressSchema} from '@/server/utils/validations/schemas'

const reviewContestSchema = z
  .object({
    contestId: z.string().uuid(),
    newStatus: z.enum([
      ContestStatus.APPROVED,
      ContestStatus.REJECTED,
      ContestStatus.PENDING,
    ]),
    rewardsTransferAddress: rewardsTransferAddressSchema.optional(),
  })
  .strict()

export type ReviewContestRequest = z.infer<typeof reviewContestSchema>

export const reviewContestAction = async (request: ReviewContestRequest) => {
  await requireJudgeServerSession()

  const {contestId, newStatus, rewardsTransferAddress} =
    reviewContestSchema.parse(request)

  const contest = await db.query.contests.findFirst({
    columns: {status: true, rewardsTransferTxHash: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new ServerError('Contest not found.')
  }

  if (
    contest.status !== ContestStatus.IN_REVIEW &&
    contest.status !== ContestStatus.PENDING
  ) {
    throw new ServerError(
      'Only pending and in review contests can be reviewed.',
    )
  }

  if (newStatus === ContestStatus.PENDING && !rewardsTransferAddress) {
    throw new ServerError(
      'Transfer wallet address is required to mark contest as pending.',
    )
  }

  if (newStatus !== ContestStatus.PENDING && rewardsTransferAddress) {
    throw new ServerError(
      'Transfer wallet address is only required when marking contest as pending.',
    )
  }

  return db
    .update(schema.contests)
    .set({status: newStatus, rewardsTransferAddress})
    .where(eq(schema.contests.id, contestId))
    .returning()
}

export const reviewContest = serializeServerErrors(reviewContestAction)
