'use server'

import {and, count, gte, inArray, lte} from 'drizzle-orm'

import {db} from '@/server/db'
import {contests} from '@/server/db/schema/contest'
import {ContestOccurence, ContestStatus} from '@/server/db/models'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'

export const getPublicContestCounts = serializeServerErrors(async () => {
  const pastCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        lte(contests.endDate, new Date()),
        inArray(contests.status, [
          ContestStatus.APPROVED,
          ContestStatus.FINISHED,
        ]),
      ),
    )

  const presentCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        lte(contests.startDate, new Date()),
        gte(contests.endDate, new Date()),
        inArray(contests.status, [
          ContestStatus.APPROVED,
          ContestStatus.FINISHED,
        ]),
      ),
    )

  const futureCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        gte(contests.startDate, new Date()),
        inArray(contests.status, [
          ContestStatus.APPROVED,
          ContestStatus.FINISHED,
        ]),
      ),
    )

  const [pastCount, presentCount, futureCount] = await Promise.all([
    pastCountPromise,
    presentCountPromise,
    futureCountPromise,
  ])

  if (!presentCount[0] || !pastCount[0] || !futureCount[0]) {
    throw new ServerError('Failed to get contest counts.')
  }

  return {
    [ContestOccurence.PRESENT]: presentCount[0].count,
    [ContestOccurence.PAST]: pastCount[0].count,
    [ContestOccurence.FUTURE]: futureCount[0].count,
  }
})
