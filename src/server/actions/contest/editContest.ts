'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'
import {isAfter, isPast} from 'date-fns'

import {addContestSchema} from './addContest'

import {db, schema} from '@/server/db'
import {requireEditableContest} from '@/server/utils/validations/contest'
import {getApiZodError} from '@/lib/utils/common/error'

const editContestSchema = addContestSchema.partial().required({id: true})

export type EditContest = z.infer<typeof editContestSchema>

export const editContest = async (request: EditContest) => {
  const result = editContestSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const updatedContest = result.data
  const existingContest = await requireEditableContest(updatedContest.id)

  const updatedStartDate = updatedContest.startDate ?? existingContest.startDate
  const updatedEndDate = updatedContest.endDate ?? existingContest.endDate

  if (isPast(updatedStartDate)) {
    throw new Error('Contest start date must be in the future.')
  }

  if (isAfter(updatedStartDate, updatedEndDate)) {
    throw new Error('Contest start date must be before end date.')
  }

  return db
    .update(schema.contests)
    .set(updatedContest)
    .where(eq(schema.contests.id, updatedContest.id))
    .returning()
}
