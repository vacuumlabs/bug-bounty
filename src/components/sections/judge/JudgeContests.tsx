'use client'

import {DateTime} from 'luxon'
import {useMemo} from 'react'

import JudgeContestsTable from './JudgeContestTable'

import Skeleton from '@/components/ui/Skeleton'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {
  useSearchParamsEnumState,
  useSearchParamsNumericState,
} from '@/lib/hooks/useSearchParamsState'
import {formatTabCount} from '@/lib/utils/common/format'
import Separator from '@/components/ui/Separator'
import {ContestOccurence} from '@/server/db/models'
import TablePagination from '@/components/ui/TablePagination'
import {JudgeContestSorting} from '@/lib/types/enums'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {useGetJudgeContests} from '@/lib/queries/contest/getJudgeContests'

export const JUDGE_CONTESTS_PAGE_SIZE = 10

const JudgeContests = () => {
  const [contestType, {setValue: setContestType}] = useSearchParamsEnumState(
    'type',
    ContestOccurence,
    ContestOccurence.FUTURE,
  )

  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)
  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(JudgeContestSorting)

  const {data: contests, isLoading} = useGetJudgeContests({
    type: contestType,
    pageParams: {
      limit: JUDGE_CONTESTS_PAGE_SIZE,
      offset: (page - 1) * JUDGE_CONTESTS_PAGE_SIZE,
    },
    sort: sortParams,
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

  return (
    <div className="flex flex-grow flex-col">
      <Tabs
        value={contestType}
        onValueChange={setContestType}
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
