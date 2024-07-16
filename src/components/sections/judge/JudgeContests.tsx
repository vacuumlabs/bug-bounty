'use client'

import {DateTime} from 'luxon'
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

  const liveContests = useMemo(
    () =>
      contests?.data.filter(
        (contest) =>
          DateTime.fromJSDate(contest.startDate) < DateTime.now() &&
          DateTime.fromJSDate(contest.endDate) > DateTime.now(),
      ),
    [contests],
  )

  const futureContests = useMemo(
    () =>
      contests?.data.filter(
        (contest) => DateTime.fromJSDate(contest.startDate) > DateTime.now(),
      ),
    [contests],
  )

  const pastContests = useMemo(
    () =>
      contests?.data.filter(
        (contest) => DateTime.fromJSDate(contest.endDate) < DateTime.now(),
      ),
    [contests],
  )

  const currentContests = useMemo(() => {
    switch (contestType) {
      case ContestOccurence.PRESENT:
        return liveContests
      case ContestOccurence.FUTURE:
        return futureContests
      case ContestOccurence.PAST:
        return pastContests
    }
  }, [contestType, liveContests, futureContests, pastContests])

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

  const getStatusOptions = useMemo(() => {
    switch (contestType) {
      case ContestOccurence.PAST:
        return selectOptions.contestStatus.filter(
          (status) =>
            status.value === ContestStatus.PENDING ||
            status.value === ContestStatus.FINISHED ||
            status.value === ContestStatus.APPROVED,
        )
      case ContestOccurence.PRESENT:
        return selectOptions.contestStatus.filter(
          (status) =>
            status.value === ContestStatus.APPROVED ||
            status.value === ContestStatus.IN_REVIEW,
        )
      case ContestOccurence.FUTURE:
        return selectOptions.contestStatus.filter(
          (status) =>
            status.value === ContestStatus.IN_REVIEW ||
            status.value === ContestStatus.REJECTED ||
            status.value === ContestStatus.APPROVED,
        )
    }
  }, [contestType])

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
        options: getStatusOptions,
      },
    ],
    [
      contestStatus,
      updateStatusSearchParams,
      updatePageSearchParams,
      getStatusOptions,
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
            }>{`Past${pastCount ? formatTabCount(pastCount) : ''}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.PRESENT
            }>{`Live${liveCount ? formatTabCount(liveCount) : ''}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.FUTURE
            }>{`Future${liveCount ? formatTabCount(futureCount) : ''}`}</TabsTrigger>
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
                contests={currentContests}
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
