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

const addContestRequestSchema = z.object({
  contest: addContestSchema,
  customWeights: addContestSeverityWeightSchema,
})

export type AddContestRequest = z.infer<typeof addContestRequestSchema>

export const addContest = async (request: AddContestRequest) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create contests.")
  }

  const result = addContestRequestSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {contest, customWeights} = result.data

  if (isPast(contest.startDate)) {
    throw new Error('Contest start date must be in the future.')
  }

  if (isAfter(contest.startDate, contest.endDate)) {
    throw new Error('Contest start date must be before end date.')
  }

  return db.transaction(async (tx) => {
    const insertedContest = await tx
      .insert(schema.contests)
      .values({
        ...contest,
        authorId: session.user.id,
      })
      .returning()

    if (!insertedContest[0]) {
      throw new Error('Failed to create contest')
    }

    await tx.insert(schema.contestSeverityWeights).values({
      contestId: insertedContest[0].id,
      ...customWeights,
    })

    return insertedContest
  })
}
