'use server'

import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireEditableContest} from '@/server/utils/validations/contest'
import {serializeServerErrors} from '@/lib/utils/common/error'

export type DeleteContestResponse = Awaited<ReturnType<typeof deleteContest>>

export const deleteContestAction = async (contestId: string) => {
  await requireEditableContest(contestId)

  return db
    .delete(schema.contests)
    .where(eq(schema.contests.id, contestId))
    .returning()
}

export const deleteContest = serializeServerErrors(deleteContestAction)
