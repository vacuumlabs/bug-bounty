'use server'

import {isAfter, isPast} from 'date-fns'
import {z} from 'zod'

import {isJudge, requireServerSession} from '@/server/utils/auth'
import {db, schema} from '@/server/db'
import {getApiZodError} from '@/lib/utils/common/error'
import {
  addContestSchema,
  addContestSeverityWeightSchema,
} from '@/server/utils/validations/schemas'

export type AddContest = {
  contest: z.infer<typeof addContestSchema>
  customWeights: z.infer<typeof addContestSeverityWeightSchema>
}

export const addContest = async (request: AddContestRequest) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create contests.")
  }

  const contestSchemaResult = addContestSchema.safeParse(request.contest)

  if (!contestSchemaResult.success) {
    return getApiZodError(contestSchemaResult.error)
  }

  const customWeightSchemaResult = addContestSeverityWeightSchema.safeParse(
    request.customWeights,
  )

  if (!customWeightSchemaResult.success) {
    return getApiZodError(customWeightSchemaResult.error)
  }

  const contest = contestSchemaResult.data
  const customWeightSchema = customWeightSchemaResult.data

  if (isPast(contest.startDate)) {
    throw new Error('Contest start date must be in the future.')
  }

  if (isAfter(contest.startDate, contest.endDate)) {
    throw new Error('Contest start date must be before end date.')
  }

  const insertedContest = await db
    .insert(schema.contests)
    .values({
      ...contest,
      authorId: session.user.id,
    })
    .returning()

  if (!insertedContest[0]) {
    throw new Error('Failed to create contest')
  }

  await db.insert(schema.contestSeverityWeights).values({
    contestId: insertedContest[0].id,
    ...customWeightSchema,
  })

  return insertedContest
}
