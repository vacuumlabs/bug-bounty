'use server'

import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireEditableFinding} from '@/server/utils/validations/finding'
import {serializeServerErrors} from '@/lib/utils/common/error'

export type DeleteFindingResponse = Awaited<ReturnType<typeof deleteFinding>>

export const deleteFindingAction = async (findingId: string) => {
  await requireEditableFinding(findingId)

  return db
    .delete(schema.findings)
    .where(eq(schema.findings.id, findingId))
    .returning()
}

export const deleteFinding = serializeServerErrors(deleteFindingAction)
