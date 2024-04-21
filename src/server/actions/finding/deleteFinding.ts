'use server'

import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireEditableFinding} from '@/server/utils/validations/finding'

export const deleteFinding = async (findingId: string) => {
  await requireEditableFinding(findingId)
  await db.delete(schema.findings).where(eq(schema.findings.id, findingId))
}
