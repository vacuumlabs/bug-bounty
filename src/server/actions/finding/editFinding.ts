'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {db, schema} from '@/server/db'
import {requireEditableFinding} from '@/server/utils/validations/finding'
import {getApiZodError} from '@/lib/utils/common/error'
import {addFindingSchema} from '@/server/utils/validations/schemas'

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
  const result = editFindingSchema.safeParse(params.finding)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const updatedFinding = result.data

  await requireEditableFinding(updatedFinding.id)

  return db
    .update(schema.findings)
    .set(updatedFinding)
    .where(eq(schema.findings.id, updatedFinding.id))
    .returning()
}
