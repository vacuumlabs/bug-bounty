'use server'

import {count, eq} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {requireServerSession} from '@/server/utils/auth'
import {deduplicatedFindings} from '@/server/db/schema/deduplicatedFinding'
import {ServerError} from '@/lib/types/error'

export type GetDeduplicatedFindingsParams = {
  contestId: string
}

export const getDeduplicatedFindingsAction = async (
  request: GetDeduplicatedFindingsParams,
) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {
      authorId: true,
    },
    where: (contests, {eq}) => eq(contests.id, request.contestId),
  })

  if (contest?.authorId !== session.user.id) {
    throw new ServerError('Unauthorized access to contest.')
  }

  return db.query.deduplicatedFindings.findMany({
    where: (deduplicatedFindings, {eq}) =>
      eq(deduplicatedFindings.contestId, request.contestId),
  })
}

export const getDeduplicatedFindings = serializeServerErrors(
  getDeduplicatedFindingsAction,
)

const getDeduplicatedFindingsCountAction = async (contestId: string) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {
      authorId: true,
    },
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (contest?.authorId !== session.user.id) {
    throw new ServerError('Unauthorized access to contest.')
  }

  const deduplicatedFindingsCount = await db
    .select({
      count: count(),
    })
    .from(deduplicatedFindings)
    .where(eq(deduplicatedFindings.contestId, contestId))

  if (!deduplicatedFindingsCount[0]) {
    throw new ServerError('Failed to get rewards total size.')
  }

  return {count: deduplicatedFindingsCount[0].count}
}

export const getDeduplicatedFindingsCount = serializeServerErrors(
  getDeduplicatedFindingsCountAction,
)
