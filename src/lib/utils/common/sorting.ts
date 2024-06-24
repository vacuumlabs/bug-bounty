import {AnyColumn, SQLWrapper, asc, desc} from 'drizzle-orm'

import {translateEnum} from './enums'

import {contests} from '@/server/db/schema/contest'
import {
  ContestSorting,
  MyFindingsRewardsSorting,
  SortDirection,
} from '@/lib/types/enums'
import {rewards} from '@/server/db/schema/reward'
import {findings} from '@/server/db/schema/finding'

export type SortParams<T extends string> = {
  direction: SortDirection
  field: T
}

export type SortOption<T extends string> = SortParams<T> & {
  labels: [string, string]
}

export type SortFieldLabelsMap<T extends string> = Record<T, [string, string]>

export const sortByColumn = (
  direction: SortDirection,
  column: SQLWrapper | AnyColumn,
) => (direction === SortDirection.ASC ? asc(column) : desc(column))

const createSortOptions = <T extends string>(
  labels: SortFieldLabelsMap<T>,
  translateEnum: (value: T) => string,
): SortOption<T>[] =>
  Object.entries<[string, string]>(labels).flatMap(
    ([key, [ascLabel, descLabel]]) => {
      const field = key as T

      return [
        {
          field,
          direction: SortDirection.ASC,
          labels: [`${translateEnum(field)}:`, ascLabel],
        },
        {
          field,
          direction: SortDirection.DESC,
          labels: [`${translateEnum(field)}:`, descLabel],
        },
      ]
    },
  )

export const contestSortFieldMap = {
  [ContestSorting.TITLE]: contests.title,
  [ContestSorting.REWARDS_AMOUNT]: contests.rewardsAmount,
  [ContestSorting.START_DATE]: contests.startDate,
  [ContestSorting.END_DATE]: contests.endDate,
}

export const contestSortFieldLabels: SortFieldLabelsMap<ContestSorting> = {
  [ContestSorting.TITLE]: ['A-Z', 'Z-A'],
  [ContestSorting.REWARDS_AMOUNT]: ['Lowest up', 'Highest up'],
  [ContestSorting.START_DATE]: ['Oldest up', 'Newest up'],
  [ContestSorting.END_DATE]: ['Oldest up', 'Newest up'],
}

export const contestSortOptions = createSortOptions(
  contestSortFieldLabels,
  translateEnum.contestSorting,
)

export const myFindingsRewardsSortFieldMap = {
  [MyFindingsRewardsSorting.PROJECT]: contests.title,
  [MyFindingsRewardsSorting.SUBMITTED]: findings.createdAt,
  [MyFindingsRewardsSorting.REVIEWED]: findings.updatedAt,
  [MyFindingsRewardsSorting.SEVERITY]: findings.severity,
  [MyFindingsRewardsSorting.REWARD]: rewards.amount,
  [MyFindingsRewardsSorting.STATE]: rewards.transferTxHash,
}
