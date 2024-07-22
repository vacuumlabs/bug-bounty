'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'
import {isAfter, isPast} from 'date-fns'

import {db, schema} from '@/server/db'
import {requireEditableContest} from '@/server/utils/validations/contest'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {
  addContestSchema,
  addContestSeverityWeightsSchema,
  rewardsTransferTxHashSchema,
} from '@/server/utils/validations/schemas'
import {ServerError} from '@/lib/types/error'
import {ContestStatus} from '@/server/db/models'

const editContestSchema = addContestSchema.partial().required({id: true})
const editContestSeverityWeightsSchema =
  addContestSeverityWeightsSchema.partial()

const editContestRequestSchema = z.object({
  contest: editContestSchema,
  customWeights: editContestSeverityWeightsSchema,
})

export type EditContestRequest = z.infer<typeof editContestRequestSchema>

export const editContestAction = async (request: EditContestRequest) => {
  const {contest, customWeights} = editContestRequestSchema.parse(request)

  const existingContest = await requireEditableContest(contest.id)

  const updatedStartDate = contest.startDate ?? existingContest.startDate
  const updatedEndDate = contest.endDate ?? existingContest.endDate

  if (isPast(updatedStartDate)) {
    throw new ServerError('Contest start date must be in the future.')
  }

  if (isAfter(updatedStartDate, updatedEndDate)) {
    throw new ServerError('Contest start date must be before end date.')
  }

  return db.transaction(async (tx) => {
    const updatedContest = await tx
      .update(schema.contests)
      .set(contest)
      .where(eq(schema.contests.id, contest.id))
      .returning()

    if (!updatedContest[0]) {
      throw new ServerError('Failed to update contest.')
    }

    await tx
      .update(schema.contestSeverityWeights)
      .set(customWeights)
      .where(eq(schema.contestSeverityWeights.contestId, updatedContest[0].id))

    return updatedContest
  })
}

export const editContest = serializeServerErrors(editContestAction)

const addContestRewardsTransferTxHashSchema = z
  .object({
    contestId: z.string().uuid(),
    rewardsTransferTxHash: rewardsTransferTxHashSchema.optional(),
  })
  .strict()

export type AddContestRewardsTransferTxHashRequest = z.infer<
  typeof addContestRewardsTransferTxHashSchema
>

export const addContestRewardsTransferTxHashAction = async (
  request: AddContestRewardsTransferTxHashRequest,
) => {
  const {contestId, rewardsTransferTxHash} =
    addContestRewardsTransferTxHashSchema.parse(request)

  const existingContest = await requireEditableContest(contestId)

  if (!existingContest.rewardsTransferAddress) {
    throw new ServerError(
      'Transfer wallet address is required to add rewards transfer tx hash.',
    )
  }

  if (existingContest.status !== ContestStatus.PENDING) {
    throw new ServerError(
      'Only pending contests can have a rewards transfer tx hash.',
    )
  }

  return db
    .update(schema.contests)
    .set({rewardsTransferTxHash})
    .where(eq(schema.contests.id, contestId))
    .returning()
}

export const addContestRewardsTransferTxHash = serializeServerErrors(
  addContestRewardsTransferTxHashAction,
)
