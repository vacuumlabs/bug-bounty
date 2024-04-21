'use server'

import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireEditableContest} from '@/server/utils/validations/contest'

export const deleteContest = async (contestId: string) => {
  await requireEditableContest(contestId)
  await db.delete(schema.contests).where(eq(schema.contests.id, contestId))
}
