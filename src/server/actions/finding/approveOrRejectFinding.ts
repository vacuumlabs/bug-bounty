'use server'

import {z} from 'zod'
import {eq} from 'drizzle-orm'
import {isFuture} from 'date-fns'

import {ContestStatus, FindingStatus} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {db, schema} from '@/server/db'
import {ServerError} from '@/lib/types/error'

const approveOrRejectFindingSchema = z.object({
  findingId: z.string().uuid(),
  newStatus: z.enum([FindingStatus.APPROVED, FindingStatus.REJECTED]),
})

export type ApproveOrRejectFindingRequest = z.infer<
  typeof approveOrRejectFindingSchema
>

export const approveOrRejectFindingAction = async (
  request: ApproveOrRejectFindingRequest,
) => {
  await requireJudgeServerSession()

  const {findingId, newStatus} = approveOrRejectFindingSchema.parse(request)

  const finding = await db.query.findings.findFirst({
    columns: {
      id: true,
      contestId: true,
      title: true,
      description: true,
      severity: true,
      status: true,
    },
    with: {
      contest: {
        columns: {endDate: true, status: true},
      },
    },
    where: (finding, {eq}) => eq(finding.id, findingId),
  })

  if (!finding) {
    throw new ServerError('Finding not found.')
  }

  if (finding.contest.status !== ContestStatus.APPROVED) {
    throw new ServerError(
      'Only findings of non-finalized approved contests can be approved/rejected.',
    )
  }

  if (isFuture(finding.contest.endDate)) {
    throw new ServerError(
      'Finding cannot be confirmed/rejected before the contest ends.',
    )
  }

  if (newStatus === FindingStatus.APPROVED) {
    return db.transaction(async (db) => {
      const deduplicatedFinding = await db
        .insert(schema.deduplicatedFindings)
        .values({
          contestId: finding.contestId,
          bestFindingId: finding.id,
          description: finding.description,
          title: finding.title,
          severity: finding.severity,
        })
        .returning()

      if (!deduplicatedFinding[0]) {
        throw new ServerError('Failed to create deduplicated finding.')
      }

      return db
        .update(schema.findings)
        .set({
          status: newStatus,
          deduplicatedFindingId: deduplicatedFinding[0].id,
        })
        .where(eq(schema.findings.id, findingId))
        .returning()
    })
  }

  return db.transaction(async (tx) => {
    // check if deduplicated finding exists before rejecting
    const deduplicatedFinding = await tx.query.deduplicatedFindings.findFirst({
      where: (deduplicatedFinding, {eq}) =>
        eq(deduplicatedFinding.bestFindingId, findingId),
    })

    if (!deduplicatedFinding) {
      return tx
        .update(schema.findings)
        .set({status: newStatus, deduplicatedFindingId: null})
        .where(eq(schema.findings.id, findingId))
        .returning()
    }

    // remove deduplicated finding id from finding
    await tx
      .update(schema.findings)
      .set({deduplicatedFindingId: null})
      .where(eq(schema.findings.deduplicatedFindingId, deduplicatedFinding.id))

    // delete deduplicated finding
    await tx
      .delete(schema.deduplicatedFindings)
      .where(eq(schema.deduplicatedFindings.id, deduplicatedFinding.id))

    return tx
      .update(schema.findings)
      .set({status: newStatus})
      .where(eq(schema.findings.id, findingId))
      .returning()
  })
}

export const approveOrRejectFinding = serializeServerErrors(
  approveOrRejectFindingAction,
)
