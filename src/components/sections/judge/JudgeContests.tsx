'use client'

import {useMemo} from 'react'

import JudgeContestsTable from './JudgeContestTable'

import Skeleton from '@/components/ui/Skeleton'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {
  mergeSearchParamsUpdaters,
  useSearchParamsEnumArrayState,
  useSearchParamsEnumState,
  useSearchParamsNumericState,
  useUpdateSearchParams,
} from '@/lib/hooks/useSearchParamsState'
import {formatTabCount} from '@/lib/utils/common/format'
import Separator from '@/components/ui/Separator'
import {ContestOccurence, ContestStatus} from '@/server/db/models'
import TablePagination from '@/components/ui/TablePagination'
import {JudgeContestSorting} from '@/lib/types/enums'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {useGetJudgeContests} from '@/lib/queries/contest/getJudgeContests'
import {Filter, FilterControls} from '@/components/ui/Filter'
import {selectOptions} from '@/lib/utils/common/enums'

export const JUDGE_CONTESTS_PAGE_SIZE = 10

const judgeContestStatusOptions = {
  [ContestOccurence.PAST]: [
    ContestStatus.IN_REVIEW,
    ContestStatus.PENDING,
    ContestStatus.FINISHED,
    ContestStatus.APPROVED,
    ContestStatus.REJECTED,
  ],
  [ContestOccurence.PRESENT]: [
    ContestStatus.IN_REVIEW,
    ContestStatus.PENDING,
    ContestStatus.APPROVED,
    ContestStatus.REJECTED,
  ],
  [ContestOccurence.FUTURE]: [
    ContestStatus.IN_REVIEW,
    ContestStatus.PENDING,
    ContestStatus.APPROVED,
    ContestStatus.REJECTED,
  ],
}

const JudgeContests = () => {
  const updateSearchParams = useUpdateSearchParams()
  const [contestType, {getSearchParamsUpdater: updateContestTypeSearchParams}] =
    useSearchParamsEnumState('type', ContestOccurence, ContestOccurence.FUTURE)
  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)
  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(JudgeContestSorting)
  const [contestStatus, {getSearchParamsUpdater: updateStatusSearchParams}] =
    useSearchParamsEnumArrayState('status', ContestStatus)

  const {data: contests, isLoading} = useGetJudgeContests({
    type: contestType,
    pageParams: {
      limit: JUDGE_CONTESTS_PAGE_SIZE,
      offset: (page - 1) * JUDGE_CONTESTS_PAGE_SIZE,
    },
    sort: sortParams,
    status: contestStatus,
  })

  const pastCount = contests?.pageParams.pastCount
  const liveCount = contests?.pageParams.liveCount
  const futureCount = contests?.pageParams.futureCount

  const currentCount = useMemo(() => {
    switch (contestType) {
      case ContestOccurence.PRESENT:
        return liveCount
      case ContestOccurence.PAST:
        return pastCount
      case ContestOccurence.FUTURE:
        return futureCount
    }
  }, [contestType, liveCount, pastCount, futureCount])

  const filters: Filter[] = useMemo(
    () => [
      {
        label: 'Status',
        values: contestStatus,
        getSearchParamsUpdater: (newValue) =>
          mergeSearchParamsUpdaters([
            updatePageSearchParams(null),
            updateStatusSearchParams(newValue),
          ]),
        options: selectOptions.contestStatus.filter((status) =>
          judgeContestStatusOptions[contestType].includes(status.value),
        ),
      },
    ],
    [
      contestStatus,
      updatePageSearchParams,
      updateStatusSearchParams,
      contestType,
    ],
  )

  const onContestOccurenceChange = (value: ContestOccurence) => {
    updateSearchParams([
      updatePageSearchParams(null),
      updateStatusSearchParams([]),
      updateContestTypeSearchParams(value),
    ])
  }

  return (
    <div className="flex flex-grow flex-col">
      <Tabs
        value={contestType}
        onValueChange={onContestOccurenceChange}
        className="flex flex-grow flex-col">
        <TabsList className="self-start px-24">
          <TabsTrigger
            value={
              ContestOccurence.PAST
            }>{`Past${formatTabCount(pastCount)}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.PRESENT
            }>{`Present${formatTabCount(liveCount)}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.FUTURE
            }>{`Future${formatTabCount(futureCount)}`}</TabsTrigger>
        </TabsList>
        <Separator />
        <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
          {isLoading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <>
              <div>
                <FilterControls filters={filters} />
              </div>
              <JudgeContestsTable
                contests={contests?.data}
                sortParams={sortParams}
                updatePageSearchParams={updatePageSearchParams}
                updateSortSearchParams={updateSortSearchParams}
                contestOccurence={contestType}
              />
              {!!currentCount && (
                <TablePagination
                  className="mt-12"
                  pageSize={JUDGE_CONTESTS_PAGE_SIZE}
                  totalCount={currentCount}
                />
              )}
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}

export default JudgeContests
