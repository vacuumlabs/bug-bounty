'use server'

import {and, count, eq, ne} from 'drizzle-orm'

import {db} from '@/server/db'
import {FindingStatus} from '@/server/db/models'
import {findings} from '@/server/db/schema/finding'
import {requireServerSession} from '@/server/utils/auth'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {deduplicatedFindings} from '@/server/db/schema/deduplicatedFinding'

export const getMyContestsReportCountsAction = async () => {
  const session = await requireServerSession()

  const totalCountPromise = db
    .select({count: count()})
    .from(findings)
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(
      and(
        ne(findings.status, FindingStatus.DRAFT),
        eq(contests.authorId, session.user.id),
      ),
    )

  const openCountPromise = db
    .select({count: count()})
    .from(findings)
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(
      and(
        eq(findings.status, FindingStatus.PENDING),
        eq(contests.authorId, session.user.id),
      ),
    )

  const approvedCountPromise = db
    .select({count: count()})
    .from(findings)
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(
      and(
        eq(findings.status, FindingStatus.APPROVED),
        eq(contests.authorId, session.user.id),
      ),
    )

  const rejectedCountPromise = db
    .select({count: count()})
    .from(findings)
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(
      and(
        eq(findings.status, FindingStatus.REJECTED),
        eq(contests.authorId, session.user.id),
      ),
    )

  const uniqueCountPromise = db
    .select({count: count()})
    .from(deduplicatedFindings)
    .leftJoin(contests, eq(deduplicatedFindings.contestId, contests.id))
    .where(eq(contests.authorId, session.user.id))

  const [totalCount, openCount, approvedCount, rejectedCount, uniqueCount] =
    await Promise.all([
      totalCountPromise,
      openCountPromise,
      approvedCountPromise,
      rejectedCountPromise,
      uniqueCountPromise,
    ])

  if (
    !totalCount[0] ||
    !openCount[0] ||
    !approvedCount[0] ||
    !rejectedCount[0] ||
    !uniqueCount[0]
  ) {
    throw new ServerError('Failed to get report counts.')
  }

  return {
    total: totalCount[0].count,
    open: openCount[0].count,
    approved: approvedCount[0].count,
    rejected: rejectedCount[0].count,
    unique: uniqueCount[0].count,
  }
}

export const getMyContestsReportCounts = serializeServerErrors(
  getMyContestsReportCountsAction,
)
