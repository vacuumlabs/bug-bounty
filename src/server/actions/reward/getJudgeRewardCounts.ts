'use server'

import {
  and,
  count,
  countDistinct,
  eq,
  isNotNull,
  isNull,
  lt,
  sumDistinct,
} from 'drizzle-orm'

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

  const [contestsToPayout, individualsToPayout] = await Promise.all([
    contestsToPayoutPromise,
    individualsToPayoutPromise,
  ])

  if (!contestsToPayout[0] || !individualsToPayout[0]) {
    throw new ServerError('Failed to get judge reward counts.')
  }

  return {
    contestsToPayoutCount: contestsToPayout[0].count,
    contestsToPayoutAmount: contestsToPayout[0].sum,
    individualsToPayout: individualsToPayout[0].count,
  }
}

export const getJudgeRewardCounts = serializeServerErrors(
  getJudgeRewardCountsAction,
)
