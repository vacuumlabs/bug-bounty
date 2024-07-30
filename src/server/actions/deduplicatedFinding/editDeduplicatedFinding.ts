'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {deduplicatedFindings} from '@/server/db/schema/deduplicatedFinding'
import {editDeduplicatedFindingSchema} from '@/server/utils/validations/schemas'

export type EditDeduplicatedFindingResponse = Awaited<
  ReturnType<typeof editDeduplicatedFindingAction>
>

export type EditDeduplicatedFindingRequest = z.infer<
  typeof editDeduplicatedFindingSchema
>

const editDeduplicatedFindingAction = async (
  request: EditDeduplicatedFindingRequest,
) => {
  await requireJudgeServerSession()

  const {deduplicatedFindingId, title, severity, description} =
    editDeduplicatedFindingSchema.parse(request)

  return db
    .update(deduplicatedFindings)
    .set({title: title, severity: severity, description: description})
    .where(eq(deduplicatedFindings.id, deduplicatedFindingId))
}

export const editDeduplicatedFinding = serializeServerErrors(
  editDeduplicatedFindingAction,
)
