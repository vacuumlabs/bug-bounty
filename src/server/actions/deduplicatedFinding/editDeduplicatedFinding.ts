'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {deduplicatedFindings} from '@/server/db/schema/deduplicatedFinding'
import {editDeduplicatedFindingSchema} from '@/server/utils/validations/schemas'
import {ServerError} from '@/lib/types/error'

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

const setBestFindingSchema = z.object({
  deduplicatedFindingId: z.string().uuid(),
  bestFindingId: z.string().uuid(),
})

export type SetBestFindingRequest = z.infer<typeof setBestFindingSchema>

export type SetBestFindingResponse = Awaited<
  ReturnType<typeof setBestFindingAction>
>

const setBestFindingAction = async (request: SetBestFindingRequest) => {
  await requireJudgeServerSession()

  const {deduplicatedFindingId, bestFindingId} =
    setBestFindingSchema.parse(request)

  const finding = await db.query.findings.findFirst({
    where: (findings, {eq}) => eq(findings.id, bestFindingId),
  })

  if (!finding) {
    throw new ServerError('Deduplicated finding not found.')
  }

  if (finding.deduplicatedFindingId !== deduplicatedFindingId) {
    throw new ServerError(
      'Finding does not belong to the deduplicated finding.',
    )
  }

  return db
    .update(deduplicatedFindings)
    .set({bestFindingId})
    .where(eq(deduplicatedFindings.id, deduplicatedFindingId))
}

export const setBestFinding = serializeServerErrors(setBestFindingAction)
