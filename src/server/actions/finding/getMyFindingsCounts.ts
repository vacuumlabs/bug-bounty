'use server'

import {and, count, eq, ne, sum} from 'drizzle-orm'

import {db} from '@/server/db'
import {FindingStatus} from '@/server/db/models'
import {findings} from '@/server/db/schema/finding'
import {requireServerSession} from '@/server/utils/auth'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {rewards} from '@/server/db/schema/reward'

export type MyFindingsCounts = Awaited<
  ReturnType<typeof getMyFindingsCountsAction>
>

export const getMyFindingsCountsAction = async () => {
  const session = await requireServerSession()

  const totalCountPromise = db
    .select({count: count()})
    .from(findings)
    .where(
      and(
        ne(findings.status, FindingStatus.DRAFT),
        eq(findings.authorId, session.user.id),
      ),
    )

  const inReviewCountPromise = db
    .select({count: count()})
    .from(findings)
    .where(
      and(
        eq(findings.status, FindingStatus.PENDING),
        eq(findings.authorId, session.user.id),
      ),
    )

  const confirmedCountPromise = db
    .select({count: count()})
    .from(findings)
    .where(
      and(
        eq(findings.status, FindingStatus.APPROVED),
        eq(findings.authorId, session.user.id),
      ),
    )

  const totalRewardsValuePromise = db
    .select({totalRewardsValue: sum(rewards.amount)})
    .from(findings)
    .where(and(eq(findings.authorId, session.user.id)))
    .leftJoin(rewards, eq(findings.id, rewards.findingId))

  const [totalCount, inReviewCount, confirmedCount, totalRewardsValue] =
    await Promise.all([
      totalCountPromise,
      inReviewCountPromise,
      confirmedCountPromise,
      totalRewardsValuePromise,
    ])

  if (
    !totalCount[0] ||
    !inReviewCount[0] ||
    !confirmedCount[0] ||
    !totalRewardsValue[0]
  ) {
    throw new ServerError('Failed to get report counts.')
  }

  return {
    total: totalCount[0].count,
    inReview: inReviewCount[0].count,
    confirmed: confirmedCount[0].count,
    totalRewardsValue: totalRewardsValue[0].totalRewardsValue,
  }
}

export const getMyFindingsCounts = serializeServerErrors(
  getMyFindingsCountsAction,
)
