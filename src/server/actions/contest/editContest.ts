'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'
import {isAfter, isPast} from 'date-fns'

import {db, schema} from '@/server/db'
import {requireEditableContest} from '@/server/utils/validations/contest'
import {getApiZodError} from '@/lib/utils/common/error'
import {
  addContestSchema,
  addContestSeverityWeightSchema,
} from '@/server/utils/validations/schemas'

const editContestSchema = addContestSchema.partial().required({id: true})
const editContestSeverityWeightSchema = addContestSeverityWeightSchema.partial()

export type EditContestRequest = {
  contest: z.infer<typeof editContestSchema>
  customWeights: z.infer<typeof editContestSeverityWeightSchema>
}

export const editContest = async (request: EditContestRequest) => {
  const contestSchemaResult = editContestSchema.safeParse(request)

  if (!contestSchemaResult.success) {
    return getApiZodError(contestSchemaResult.error)
  }

  const customWeightSchemaResult = addContestSeverityWeightSchema.safeParse(
    request.customWeights,
  )

  if (!customWeightSchemaResult.success) {
    return getApiZodError(customWeightSchemaResult.error)
  }

  const updateContestRequest = contestSchemaResult.data
  const updateCustomWeightRequest = customWeightSchemaResult.data

  const existingContest = await requireEditableContest(updateContestRequest.id)

  const updatedStartDate =
    updateContestRequest.startDate ?? existingContest.startDate
  const updatedEndDate = updateContestRequest.endDate ?? existingContest.endDate

  if (isPast(updatedStartDate)) {
    throw new Error('Contest start date must be in the future.')
  }

  if (isAfter(updatedStartDate, updatedEndDate)) {
    throw new Error('Contest start date must be before end date.')
  }

  return db.transaction(async (tx) => {
    const updatedContest = await tx
      .update(schema.contests)
      .set(updateContestRequest)
      .where(eq(schema.contests.id, updateContestRequest.id))
      .returning()

    if (!updatedContest[0]) {
      throw new Error('Failed to update contest')
    }

    await tx
      .update(schema.contestSeverityWeights)
      .set(updateCustomWeightRequest)
      .where(eq(schema.contestSeverityWeights.contestId, updatedContest[0].id))

    return updatedContest
  })
}
