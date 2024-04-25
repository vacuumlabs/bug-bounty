'use server'

import {db} from '@/server/db'
import {ContestStatus} from '@/server/db/models'

export type GetPublicContestsParams = {
  limit?: number
  offset?: number
  type?: 'past' | 'current' | 'future'
  searchQuery?: string
}

export const getPublicContests = async ({
  limit,
  offset,
  type,
  searchQuery,
}: GetPublicContestsParams) => {
  return db.query.contests.findMany({
    limit,
    offset,
    where: (contests, {and, or, inArray, ilike, gte, lte}) =>
      and(
        inArray(contests.status, [
          ContestStatus.APPROVED,
          ContestStatus.FINISHED,
        ]),
        type === 'past' ? lte(contests.endDate, new Date()) : undefined,
        type === 'current'
          ? and(
              lte(contests.startDate, new Date()),
              gte(contests.endDate, new Date()),
            )
          : undefined,
        type === 'future' ? gte(contests.startDate, new Date()) : undefined,
        searchQuery
          ? or(
              ilike(contests.title, `%${searchQuery}%`),
              ilike(contests.description, `%${searchQuery}%`),
            )
          : undefined,
      ),
    orderBy: (contests, {desc}) => desc(contests.startDate),
  })
}
