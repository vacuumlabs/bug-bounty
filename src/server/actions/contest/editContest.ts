'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'
import {isAfter, isPast} from 'date-fns'

import {db, schema} from '@/server/db'
import {requireEditableContest} from '@/server/utils/validations/contest'
import {getApiZodError} from '@/lib/utils/common/error'
import {
  addContestSchema,
  addContestSeverityWeightsSchema,
} from '@/server/utils/validations/schemas'

const editContestSchema = addContestSchema.partial().required({id: true})
const editContestSeverityWeightsSchema =
  addContestSeverityWeightsSchema.partial()

const editContestRequestSchema = z.object({
  contest: editContestSchema,
  customWeights: editContestSeverityWeightsSchema,
})
export type EditContestRequest = z.infer<typeof editContestRequestSchema>

export const editContest = async (request: EditContestRequest) => {
  const result = editContestRequestSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {contest, customWeights} = result.data

  const existingContest = await requireEditableContest(contest.id)

  const updatedStartDate = contest.startDate ?? existingContest.startDate
  const updatedEndDate = contest.endDate ?? existingContest.endDate

  if (isPast(updatedStartDate)) {
    throw new Error('Contest start date must be in the future.')
  }

  if (isAfter(updatedStartDate, updatedEndDate)) {
    throw new Error('Contest start date must be before end date.')
  }

  return db.transaction(async (tx) => {
    const updatedContest = await tx
      .update(schema.contests)
      .set(contest)
      .where(eq(schema.contests.id, contest.id))
      .returning()

    if (!updatedContest[0]) {
      throw new Error('Failed to update contest')
    }

    await tx
      .update(schema.contestSeverityWeights)
      .set(customWeights)
      .where(eq(schema.contestSeverityWeights.contestId, updatedContest[0].id))

    return updatedContest
  })
}
