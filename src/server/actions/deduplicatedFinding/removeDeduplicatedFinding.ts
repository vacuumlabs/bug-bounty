'use server'

import {eq} from 'drizzle-orm'
import {z} from 'zod'

import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {findings} from '@/server/db/schema/finding'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {deduplicatedFindings} from '@/server/db/schema/deduplicatedFinding'

export type RemoveDeduplicatedFindingResponse = Awaited<
  ReturnType<typeof removeDeduplicatedFindingAction>
>

const removeDeduplicatedFindingSchema = z.object({
  findingId: z.string().uuid(),
})

export type RemoveDeduplicatedFindingRequest = z.infer<
  typeof removeDeduplicatedFindingSchema
>

const removeDeduplicatedFindingAction = async (
  request: RemoveDeduplicatedFindingRequest,
) => {
  await requireJudgeServerSession()

  const {findingId} = removeDeduplicatedFindingSchema.parse(request)

  const finding = await db.query.findings.findFirst({
    where: (findings, {eq}) => eq(findings.id, findingId),
  })

  if (!finding) {
    throw new ServerError('Finding not found.')
  }

  const deduplicatedFindingId = finding.deduplicatedFindingId

  if (!deduplicatedFindingId) {
    throw new ServerError('Finding has no deduplicated finding.')
  }

  const deduplilcatedFinding = await db.query.deduplicatedFindings.findFirst({
    where: (deduplicatedFindings, {eq}) =>
      eq(deduplicatedFindings.id, deduplicatedFindingId),
  })

  if (!deduplilcatedFinding) {
    throw new ServerError('Deduplicated finding not found.')
  }

  if (deduplilcatedFinding.bestFindingId === findingId) {
    throw new ServerError('Can not remove deduplicate best finding.')
  }

  return db.transaction(async (tx) => {
    const newDeduplicatedFinding = await tx
      .insert(deduplicatedFindings)
      .values({
        contestId: finding.contestId,
        bestFindingId: finding.id,
        description: finding.description,
        title: finding.title,
        severity: finding.severity,
      })
      .returning()

    if (!newDeduplicatedFinding[0]) {
      throw new ServerError('Failed to create deduplicated finding.')
    }

    return tx
      .update(findings)
      .set({
        deduplicatedFindingId: newDeduplicatedFinding[0].id,
      })
      .where(eq(findings.id, findingId))
      .returning()
  })
}

export const removeDeduplicatedFinding = serializeServerErrors(
  removeDeduplicatedFindingAction,
)
