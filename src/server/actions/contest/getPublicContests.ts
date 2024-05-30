'use server'

import {arrayOverlaps} from 'drizzle-orm'

import {db} from '@/server/db'
import {
  ContestOccurence,
  ContestStatus,
  ProjectCategory,
  ProjectLanguage,
} from '@/server/db/models'
import {
  contestSortFieldMap,
  sortByColumn,
  SortParams,
} from '@/lib/utils/common/sorting'
import {ContestSorting, SortDirection} from '@/lib/types/enums'

export type GetPublicContestsParams = {
  limit?: number
  offset?: number
  type?: ContestOccurence
  searchQuery?: string
  projectCategory?: ProjectCategory[]
  projectLanguage?: ProjectLanguage[]
  sort?: SortParams<ContestSorting>
}

export const getPublicContests = async ({
  limit,
  offset,
  type,
  searchQuery,
  projectCategory,
  projectLanguage,
  sort = {field: ContestSorting.START_DATE, direction: SortDirection.DESC},
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
      ),
    orderBy: sortByColumn(sort.direction, contestSortFieldMap[sort.field]),
  })
}
