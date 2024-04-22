'use server'

import {isAfter, isPast} from 'date-fns'
import {z} from 'zod'

import {isJudge, requireServerSession} from '@/server/utils/auth'
import {db, schema} from '@/server/db'
import {getApiZodError} from '@/lib/utils/common/error'
import {addContestSchema} from '@/server/utils/validations/schemas'

export type AddContest = z.infer<typeof addContestSchema>

export const addContest = async (request: AddContest) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create contests.")
  }

  const result = addContestSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const contest = result.data

  if (isPast(contest.startDate)) {
    throw new Error('Contest start date must be in the future.')
  }

  if (isAfter(contest.startDate, contest.endDate)) {
    throw new Error('Contest start date must be before end date.')
  }

  return db
    .insert(schema.contests)
    .values({
      ...contest,
      authorId: session.user.id,
    })
    .returning()
}
