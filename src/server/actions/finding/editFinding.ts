'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {addFindingSchema} from './addFinding'

import {db, schema} from '@/server/db'
import {requireEditableFinding} from '@/server/utils/validations/finding'

const editFindingSchema = addFindingSchema
  .omit({contestId: true})
  .partial()
  .required({id: true})
  .strict()

export type EditFinding = z.infer<typeof editFindingSchema>

export type EditFindingParams = {
  finding: EditFinding
}

// TODO: Edit finding attachments
export const editFinding = async (params: EditFindingParams) => {
  const updatedFinding = editFindingSchema.parse(params.finding)

  await requireEditableFinding(updatedFinding.id)

  return db
    .update(schema.findings)
    .set(updatedFinding)
    .where(eq(schema.findings.id, updatedFinding.id))
    .returning()
}
