import {AnyColumn, SQLWrapper, asc, desc, sql} from 'drizzle-orm'

import {translateEnum} from './enums'

import {contests} from '@/server/db/schema/contest'
import {
  ContestSorting,
  MyFindingsRewardsSorting,
  MyFindingsSorting,
  SortDirection,
} from '@/lib/types/enums'
import {rewards} from '@/server/db/schema/reward'
import {findings} from '@/server/db/schema/finding'
import {ContestStatus, FindingSeverity, FindingStatus} from '@/server/db/models'

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
  [MyFindingsRewardsSorting.SEVERITY]: sql<number>`
  CASE ${findings.severity}
    WHEN ${FindingSeverity.INFO} THEN 1
    WHEN ${FindingSeverity.LOW} THEN 2
    WHEN ${FindingSeverity.MEDIUM} THEN 3
    WHEN ${FindingSeverity.HIGH} THEN 4
    WHEN ${FindingSeverity.CRITICAL} THEN 5
    ELSE 6
  END`,
  [MyFindingsRewardsSorting.REWARD]: rewards.amount,
  [MyFindingsRewardsSorting.STATE]: rewards.transferTxHash,
}

export const myFindingsSortFieldMap = {
  [MyFindingsSorting.PROJECT]: contests.title,
  [MyFindingsSorting.FINDING]: findings.title,
  [MyFindingsSorting.SUBMITTED]: findings.createdAt,
  [MyFindingsSorting.SEVERITY]: sql<number>`
  CASE ${findings.severity}
    WHEN ${FindingSeverity.INFO} THEN 1
    WHEN ${FindingSeverity.LOW} THEN 2
    WHEN ${FindingSeverity.MEDIUM} THEN 3
    WHEN ${FindingSeverity.HIGH} THEN 4
    WHEN ${FindingSeverity.CRITICAL} THEN 5
    ELSE 6
  END`,
  [MyFindingsSorting.PROJECT_STATE]: sql<number>`
  CASE ${contests.status}
    WHEN ${ContestStatus.REJECTED} THEN 1
    WHEN ${ContestStatus.DRAFT} THEN 2
    WHEN ${ContestStatus.PENDING} THEN 3
    WHEN ${ContestStatus.APPROVED} THEN 4
    WHEN ${ContestStatus.IN_REVIEW} THEN 5
    WHEN ${ContestStatus.FINISHED} THEN 6
    ELSE 7
  END`,
  [MyFindingsSorting.STATUS]: sql<number>`
  CASE ${findings.status}
    WHEN ${FindingStatus.REJECTED} THEN 1
    WHEN ${FindingStatus.DRAFT} THEN 2
    WHEN ${FindingStatus.PENDING} THEN 3
    WHEN ${FindingStatus.APPROVED} THEN 4
    ELSE 5
  END`,
}
