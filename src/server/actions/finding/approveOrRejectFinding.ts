;`use server`

import {z} from 'zod'
import {eq} from 'drizzle-orm'
import {isFuture} from 'date-fns'

import {FindingStatus} from '@/server/db/models'
import {requireJudgeAuth} from '@/server/utils/auth'
import {getApiZodError} from '@/lib/utils/common/error'
import {db, schema} from '@/server/db'

const approveOrRejectFindingSchema = z.object({
  findingId: z.string(),
  newStatus: z.enum([FindingStatus.APPROVED, FindingStatus.REJECTED]),
})

export type ApproveOrRejectFindingRequest = z.infer<
  typeof approveOrRejectFindingSchema
>

export const approveOrRejectFinding = async (
  request: ApproveOrRejectFindingRequest,
) => {
  await requireJudgeAuth()

  const result = approveOrRejectFindingSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {findingId, newStatus} = result.data

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
        columns: {endDate: true},
      },
    },
    where: (finding, {eq}) => eq(finding.id, findingId),
  })

  if (!finding) {
    throw new Error('Finding not found.')
  }

  if (finding.status !== FindingStatus.PENDING) {
    throw new Error('Only pending findings can be confirmed/rejected.')
  }

  if (isFuture(finding.contest.endDate)) {
    throw new Error(
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
        throw new Error('Failed to create deduplicated finding.')
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

  return db
    .update(schema.findings)
    .set({status: newStatus})
    .where(eq(schema.findings.id, findingId))
    .returning()
}
