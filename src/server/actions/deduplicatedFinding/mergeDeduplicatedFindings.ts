'use server'

import {z} from 'zod'
import {isFuture} from 'date-fns'
import {eq, inArray} from 'drizzle-orm'

import {requireJudgeAuth} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {db, schema} from '@/server/db'
import {ServerError} from '@/lib/types/error'

const mergeDeduplicatedFindingsSchema = z.object({
  bestDeduplicatedFindingId: z.string().uuid(),
  deduplicatedFindingIds: z.array(z.string().uuid()).nonempty(),
})

export type MergeDeduplicatedFindingsRequest = z.infer<
  typeof mergeDeduplicatedFindingsSchema
>

export type MergeDeduplicatedFindingsResponse = Awaited<
  ReturnType<typeof mergeDeduplicatedFindings>
>

export const mergeDeduplicatedFindingsAction = async (
  request: MergeDeduplicatedFindingsRequest,
) => {
  await requireJudgeAuth()

  const {bestDeduplicatedFindingId, deduplicatedFindingIds} =
    mergeDeduplicatedFindingsSchema.parse(request)

  return db.transaction(async (tx) => {
    const bestDeduplicatedFinding =
      await tx.query.deduplicatedFindings.findFirst({
        with: {
          contest: {
            columns: {id: true, endDate: true},
          },
        },
        where: (deduplicatedFinding, {eq}) =>
          eq(deduplicatedFinding.id, bestDeduplicatedFindingId),
      })

    if (!bestDeduplicatedFinding) {
      throw new ServerError('Main deduplicated finding not found.')
    }

    if (isFuture(bestDeduplicatedFinding.contest.endDate)) {
      throw new ServerError(
        'Deduplicated findings cannot be merged before the contest ends.',
      )
    }

    const deduplicatedFindings = await tx.query.deduplicatedFindings.findMany({
      with: {
        contest: {
          columns: {id: true},
        },
        findings: {
          columns: {id: true},
        },
      },
      where: (deduplicatedFinding, {inArray}) =>
        inArray(deduplicatedFinding.id, deduplicatedFindingIds),
    })

    const isSameContest = deduplicatedFindings.every(
      (deduplicatedFinding) =>
        deduplicatedFinding.contest.id === bestDeduplicatedFinding.contest.id,
    )

    if (!isSameContest) {
      throw new ServerError(
        'Deduplicated findings must be in the same contest.',
      )
    }

    const updateFindings = deduplicatedFindings.flatMap((deduplicatedFinding) =>
      deduplicatedFinding.findings.map((finding) =>
        tx
          .update(schema.findings)
          .set({deduplicatedFindingId: bestDeduplicatedFindingId})
          .where(eq(schema.findings.id, finding.id)),
      ),
    )

    await Promise.all(updateFindings)

    await tx
      .delete(schema.deduplicatedFindings)
      .where(inArray(schema.deduplicatedFindings.id, deduplicatedFindingIds))

    const updatedDeduplicatedFindings =
      await tx.query.deduplicatedFindings.findFirst({
        with: {
          findings: true,
        },
        where: (deduplicatedFinding, {eq}) =>
          eq(deduplicatedFinding.id, bestDeduplicatedFindingId),
      })

    if (!updatedDeduplicatedFindings) {
      throw new ServerError('Updated deduplicated finding not found.')
    }

    return updatedDeduplicatedFindings
  })
}

export const mergeDeduplicatedFindings = serializeServerErrors(
  mergeDeduplicatedFindingsAction,
)
