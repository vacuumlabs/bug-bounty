'use server'

import {isAfter, isPast} from 'date-fns'
import {z} from 'zod'

import {isJudge, requireServerSession} from '@/server/utils/auth'
import {db, schema} from '@/server/db'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {
  addContestSchema,
  addContestSeverityWeightsSchema,
} from '@/server/utils/validations/schemas'
import {ServerError} from '@/lib/types/error'

const addContestRequestSchema = z.object({
  contest: addContestSchema,
  customWeights: addContestSeverityWeightsSchema,
})

export type AddContestRequest = z.infer<typeof addContestRequestSchema>

export const addContestAction = async (request: AddContestRequest) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new ServerError("Judges can't create contests.")
  }

  const {contest, customWeights} = addContestRequestSchema.parse(request)

  if (isPast(contest.startDate)) {
    throw new ServerError('Contest start date must be in the future.')
  }

  if (isAfter(contest.startDate, contest.endDate)) {
    throw new ServerError('Contest start date must be before end date.')
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
      throw new ServerError('Failed to create contest.')
    }

    await tx.insert(schema.contestSeverityWeights).values({
      contestId: insertedContest[0].id,
      ...customWeights,
    })

    return insertedContest
  })
}

export const addContest = serializeServerErrors(addContestAction)
