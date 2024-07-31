'use server'

import {
  and,
  count,
  countDistinct,
  eq,
  gt,
  isNotNull,
  isNull,
  lt,
  ne,
  or,
  sql,
  sumDistinct,
} from 'drizzle-orm'

import {db} from '@/server/db'
import {ContestStatus, FindingStatus} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {findings} from '@/server/db/schema/finding'
import {rewards} from '@/server/db/schema/reward'

export const getJudgeContestCountsAction = async () => {
  await requireJudgeServerSession()

  const toReviewCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        or(
          eq(contests.status, ContestStatus.PENDING),
          eq(contests.status, ContestStatus.IN_REVIEW),
        ),
        gt(contests.startDate, new Date()),
      ),
    )

  const pendingFindingsCountSubQuery = db
    .select({
      contestId: findings.contestId,
      count: count().as('pendingFindingsCount'),
    })
    .from(findings)
    .where(eq(findings.status, FindingStatus.PENDING))
    .groupBy(findings.contestId)
    .as('pendingFindingsCountSubQuery')

  const toJudgeCountPromise = db
    .select({count: countDistinct(contests.id)})
    .from(contests)
    .leftJoin(
      pendingFindingsCountSubQuery,
      eq(contests.id, pendingFindingsCountSubQuery.contestId),
    )
    .where(
      and(
        ne(pendingFindingsCountSubQuery.count, 0),
        eq(contests.status, ContestStatus.APPROVED),
        lt(contests.endDate, new Date()),
      ),
    )

  const toFinalizeCountPromise = db
    .select({count: countDistinct(contests.id)})
    .from(contests)
    .leftJoin(
      pendingFindingsCountSubQuery,
      eq(contests.id, pendingFindingsCountSubQuery.contestId),
    )
    .where(
      and(
        eq(sql`coalesce(${pendingFindingsCountSubQuery.count}, 0)`, 0),
        eq(contests.status, ContestStatus.APPROVED),
        lt(contests.endDate, new Date()),
      ),
    )

  const toPayoutPromise = db
    .select({
      count: countDistinct(contests.id),
      sum: sumDistinct(contests.distributedRewardsAmount),
    })
    .from(contests)
    .leftJoin(findings, eq(contests.id, findings.contestId))
    .leftJoin(rewards, eq(findings.id, rewards.findingId))
    .where(
      and(
        isNull(rewards.transferTxHash),
        isNotNull(contests.rewardsTransferTxHash),
        eq(contests.status, ContestStatus.FINISHED),
        lt(contests.endDate, new Date()),
      ),
    )

  const [toReviewCount, toJudgeCount, toFinalizeCount, toPayout] =
    await Promise.all([
      toReviewCountPromise,
      toJudgeCountPromise,
      toFinalizeCountPromise,
      toPayoutPromise,
    ])

  if (
    !toReviewCount[0] ||
    !toJudgeCount[0] ||
    !toFinalizeCount[0] ||
    !toPayout[0]
  ) {
    throw new ServerError('Failed to get judge contest counts.')
  }

  return {
    toReview: toReviewCount[0].count,
    toJudge: toJudgeCount[0].count,
    toFinalize: toFinalizeCount[0].count,
    toPayout: toPayout[0].count,
  }
}

export const getJudgeContestCounts = serializeServerErrors(
  getJudgeContestCountsAction,
)
