'use server'

import {count, countDistinct, desc, eq, sql, sum} from 'drizzle-orm'

import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {findings} from '@/server/db/schema/finding'
import {rewards} from '@/server/db/schema/reward'
import {users} from '@/server/db/schema/user'
import {ContestStatus} from '@/server/db/models'
import {PaginatedParams} from '@/lib/utils/common/pagination'

export type GetContestLeaderboardParams = PaginatedParams<{
  contestId: string
}>

export type ContestLeaderboard = Awaited<
  ReturnType<typeof getContestLeaderboardAction>
>

const getContestLeaderboardAction = async ({
  contestId,
  pageParams: {limit, offset = 0},
}: GetContestLeaderboardParams) => {
  const contest = await db.query.contests.findFirst({
    where: (contests, {eq}) => eq(contests.id, contestId),
    columns: {
      status: true,
    },
  })

  if (!contest) {
    throw new ServerError('Contest not found.')
  }

  if (contest.status !== ContestStatus.FINISHED) {
    throw new ServerError('Contest is not over yet.')
  }

  const userRewards = db
    .select({
      userId: findings.authorId,
      totalRewards: sum(rewards.amount).mapWith(Number).as('totalRewards'),
      totalBugs: count(findings.id).mapWith(Number).as('totalBugs'),
      infoFindings:
        sql<number>`COUNT(${findings.id}) FILTER (WHERE ${findings.severity} = 'info')`
          .mapWith(Number)
          .as('infoFindings'),
      lowFindings:
        sql<number>`COUNT(${findings.id}) FILTER (WHERE ${findings.severity} = 'low')`
          .mapWith(Number)
          .as('lowFindings'),
      mediumFindings:
        sql<number>`COUNT(${findings.id}) FILTER (WHERE ${findings.severity} = 'medium')`
          .mapWith(Number)
          .as('mediumFindings'),
      highFindings:
        sql<number>`COUNT(${findings.id}) FILTER (WHERE ${findings.severity} = 'high')`
          .mapWith(Number)
          .as('highFindings'),
      criticalFindings:
        sql<number>`COUNT(${findings.id}) FILTER (WHERE ${findings.severity} = 'critical')`
          .mapWith(Number)
          .as('criticalFindings'),
    })
    .from(findings)
    .where(eq(findings.contestId, contestId))
    .leftJoin(rewards, eq(rewards.findingId, findings.id))
    .groupBy(findings.authorId)
    .as('userRewards')

  const contestLeaderboard = await db
    .select({
      userId: users.id,
      alias: users.alias,
      totalRewards: userRewards.totalRewards,
      totalBugs: userRewards.totalBugs,
      infoFindings: userRewards.infoFindings,
      lowFindings: userRewards.lowFindings,
      mediumFindings: userRewards.mediumFindings,
      highFindings: userRewards.highFindings,
      criticalFindings: userRewards.criticalFindings,
    })
    .from(userRewards)
    .leftJoin(users, eq(users.id, userRewards.userId))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(userRewards.totalRewards))

  return contestLeaderboard
}

export const getContestLeaderboard = serializeServerErrors(
  getContestLeaderboardAction,
)

const getContestLeaderboardCountAction = async (contestId: string) => {
  const findingAuthorsCount = await db
    .select({
      count: countDistinct(findings.authorId),
    })
    .from(findings)
    .where(eq(findings.contestId, contestId))

  if (!findingAuthorsCount[0]) {
    throw new ServerError('Failed to get findings authours total size.')
  }

  return {count: findingAuthorsCount[0].count}
}

export const getContestLeaderboardCount = serializeServerErrors(
  getContestLeaderboardCountAction,
)
