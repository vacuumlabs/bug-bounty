'use server'

import {isAfter, isPast} from 'date-fns'
import {z} from 'zod'

import {insertContestSchema} from '@/server/db/schema/contest'
import {isJudge, requireServerSession} from '@/server/utils/auth'
import {db, schema} from '@/server/db'
import {ContestStatus} from '@/server/db/models'

export const addContestSchema = insertContestSchema
  .omit({authorId: true})
  .extend({
    status: z.enum([ContestStatus.PENDING, ContestStatus.DRAFT]),
  })
  .strict()

export type AddContest = z.infer<typeof addContestSchema>

export const addContest = async (request: AddContest) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create contests.")
  }

  const contest = addContestSchema.parse(request)

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
