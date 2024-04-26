'use server'

import {z} from 'zod'
import {isFuture} from 'date-fns'
import {eq, inArray} from 'drizzle-orm'

import {requireJudgeAuth} from '@/server/utils/auth'
import {getApiZodError} from '@/lib/utils/common/error'
import {db, schema} from '@/server/db'

const mergeDeduplicatedFindingsSchema = z.object({
  bestDeduplicatedFindingId: z.string(),
  deduplicatedFindingIds: z.array(z.string()).nonempty(),
})

export type MergeDeduplicatedFindingsRequest = z.infer<
  typeof mergeDeduplicatedFindingsSchema
>

export type MergeDeduplicatedFindingsResponse = Awaited<
  ReturnType<typeof mergeDeduplicatedFindings>
>

export const mergeDeduplicatedFindings = async (
  request: MergeDeduplicatedFindingsRequest,
) => {
  await requireJudgeAuth()

  const result = mergeDeduplicatedFindingsSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {bestDeduplicatedFindingId, deduplicatedFindingIds} = result.data

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
      throw new Error('Main deduplicated finding not found.')
    }

    if (isFuture(bestDeduplicatedFinding.contest.endDate)) {
      throw new Error(
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
      throw new Error('Deduplicated findings must be in the same contest.')
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
      throw new Error('Updated deduplicated finding not found.')
    }

    return updatedDeduplicatedFindings
  })
}
