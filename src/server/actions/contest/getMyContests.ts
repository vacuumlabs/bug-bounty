'use server'

import {sql} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {ContestOccurence, FindingStatus} from '@/server/db/models'
import {requireServerSession} from '@/server/utils/auth'

export type GetMyContestsParams = {
  type?: ContestOccurence
}

export type ContestWithFindingCounts = Awaited<
  ReturnType<typeof getMyContestAction>
>[number]

export const getMyContestAction = async ({type}: GetMyContestsParams) => {
  const session = await requireServerSession()

  return db.query.contests.findMany({
    where: (contests, {and, gte, lte, eq}) =>
      and(
        eq(contests.authorId, session.user.id),
        type === ContestOccurence.PAST
          ? lte(contests.endDate, new Date())
          : undefined,
        type === ContestOccurence.PRESENT
          ? and(
              lte(contests.startDate, new Date()),
              gte(contests.endDate, new Date()),
            )
          : undefined,
        type === ContestOccurence.FUTURE
          ? gte(contests.startDate, new Date())
          : undefined,
      ),
    orderBy: (contests, {desc}) => desc(contests.startDate),
    extras: {
      pendingFindingsCount:
        sql<number>`(SELECT count(*) from finding where finding.status = ${FindingStatus.PENDING} and "finding"."contestId" = contests.id)`.as(
          'pendingFindingsCount',
        ),
      approvedFindingsCount:
        sql<number>`(SELECT count(*) from finding where finding.status = ${FindingStatus.APPROVED} and "finding"."contestId" = contests.id)`.as(
          'approvedFindingsCount',
        ),
      rejectedFindingsCount:
        sql<number>`(SELECT count(*) from finding where finding.status = ${FindingStatus.REJECTED} and "finding"."contestId" = contests.id)`.as(
          'rejectedFindingsCount',
        ),
    },
  })
}

export const getMyContests = serializeServerErrors(getMyContestAction)
