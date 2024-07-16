'use server'

import {and, count, eq, isNull, lt} from 'drizzle-orm'

import {db} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'

export const getJudgeContestCountsAction = async () => {
  await requireJudgeServerSession()

  const toReviewCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(eq(contests.status, ContestStatus.IN_REVIEW))

  const toJudgeCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        eq(contests.status, ContestStatus.APPROVED),
        lt(contests.endDate, new Date()),
      ),
    )

  const toRewardCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        isNull(contests.distributedRewardsAmount),
        eq(contests.status, ContestStatus.PENDING),
        lt(contests.endDate, new Date()),
      ),
    )

  const [toReviewCount, toJudgeCount, toRewardCount] = await Promise.all([
    toReviewCountPromise,
    toJudgeCountPromise,
    toRewardCountPromise,
  ])

  if (!toReviewCount[0] || !toJudgeCount[0] || !toRewardCount[0]) {
    throw new ServerError('Failed to get judge contest counts.')
  }

  return {
    toReview: toReviewCount[0].count,
    toJudge: toJudgeCount[0].count,
    toReward: toRewardCount[0].count,
  }
}

export const getJudgeContestCounts = serializeServerErrors(
  getJudgeContestCountsAction,
)
