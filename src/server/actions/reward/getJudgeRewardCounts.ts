'use server'

import {and, count, eq, isNotNull, isNull, lt, sum} from 'drizzle-orm'

import {db} from '@/server/db'
import {ContestStatus} from '@/server/db/models'
import {requireJudgeServerSession} from '@/server/utils/auth'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {rewards} from '@/server/db/schema/reward'
import {findings} from '@/server/db/schema/finding'

export const getJudgeRewardCountsAction = async () => {
  await requireJudgeServerSession()

  const contestsToPayoutPromise = db
    .select({count: count(), sum: sum(contests.distributedRewardsAmount)})
    .from(contests)
    .where(
      and(
        isNotNull(contests.rewardsTransferTxHash),
        eq(contests.status, ContestStatus.FINISHED),
        lt(contests.endDate, new Date()),
      ),
    )

  const individualsToPayoutPromise = db
    .select({count: count()})
    .from(rewards)
    .leftJoin(findings, eq(rewards.findingId, findings.id))
    .leftJoin(contests, eq(findings.contestId, contests.id))
    .where(
      and(
        isNull(rewards.transferTxHash),
        isNotNull(contests.rewardsTransferTxHash),
        eq(contests.status, ContestStatus.FINISHED),
        lt(contests.endDate, new Date()),
      ),
    )

  const pendingContestsCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        isNull(contests.rewardsTransferTxHash),
        eq(contests.status, ContestStatus.FINISHED),
        lt(contests.endDate, new Date()),
      ),
    )

  const [contestsToPayout, pendingContestsCount, individualsToPayout] =
    await Promise.all([
      contestsToPayoutPromise,
      pendingContestsCountPromise,
      individualsToPayoutPromise,
    ])

  if (
    !contestsToPayout[0] ||
    !pendingContestsCount[0] ||
    !individualsToPayout[0]
  ) {
    throw new ServerError('Failed to get judge reward counts.')
  }

  return {
    contestsToPayoutCount: contestsToPayout[0].count,
    contestsToPayoutAmount: contestsToPayout[0].sum,
    individualsToPayout: individualsToPayout[0].count,
    pendingContests: pendingContestsCount[0].count,
  }
}

export const getJudgeRewardCounts = serializeServerErrors(
  getJudgeRewardCountsAction,
)
