'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db, schema} from '@/server/db'
import {requireEditableFinding} from '@/server/utils/validations/finding'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {addFindingSchema} from '@/server/utils/validations/schemas'

const editFindingSchema = addFindingSchema
  .omit({contestId: true})
  .partial()
  .required({id: true})
  .strict()

export type EditFinding = z.infer<typeof editFindingSchema>

export type EditFindingRequest = {
  finding: EditFinding
}

// TODO: Edit finding attachments
export const editFindingAction = async (request: EditFindingRequest) => {
  const updatedFinding = editFindingSchema.parse(request.finding)

  await requireEditableFinding(updatedFinding.id)

  return db
    .update(schema.findings)
    .set(updatedFinding)
    .where(eq(schema.findings.id, updatedFinding.id))
    .returning()
}

export const editFinding = serializeServerErrors(editFindingAction)
