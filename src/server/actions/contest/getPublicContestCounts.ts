'use server'

import {
  and,
  arrayOverlaps,
  count,
  gte,
  ilike,
  inArray,
  lte,
  or,
} from 'drizzle-orm'

import {db} from '@/server/db'
import {contests} from '@/server/db/schema/contest'
import {
  ContestOccurence,
  ContestStatus,
  ProjectCategory,
  ProjectLanguage,
} from '@/server/db/models'
import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'

export type GetPublicContestCountsParams = {
  searchQuery?: string
  projectCategory?: ProjectCategory[]
  projectLanguage?: ProjectLanguage[]
}

export const getPublicContestCountsAction = async ({
  projectCategory,
  projectLanguage,
  searchQuery,
}: GetPublicContestCountsParams) => {
  const queryFilters = [
    inArray(contests.status, [ContestStatus.APPROVED, ContestStatus.FINISHED]),
    searchQuery
      ? or(
          ilike(contests.title, `%${searchQuery}%`),
          ilike(contests.description, `%${searchQuery}%`),
        )
      : undefined,
    projectCategory?.length
      ? arrayOverlaps(contests.projectCategory, projectCategory)
      : undefined,
    projectLanguage?.length
      ? arrayOverlaps(contests.projectLanguage, projectLanguage)
      : undefined,
  ]

  const pastCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(and(lte(contests.endDate, new Date()), ...queryFilters))

  const presentCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(
      and(
        lte(contests.startDate, new Date()),
        gte(contests.endDate, new Date()),
        ...queryFilters,
      ),
    )

  const futureCountPromise = db
    .select({count: count()})
    .from(contests)
    .where(and(gte(contests.startDate, new Date()), ...queryFilters))

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
}

export const getPublicContestCounts = serializeServerErrors(
  getPublicContestCountsAction,
)
