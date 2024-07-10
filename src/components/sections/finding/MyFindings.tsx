'use client'

import {DateTime} from 'luxon'
import {useMemo} from 'react'

import MyFindingsTable from './MyFindingsTable'

import Skeleton from '@/components/ui/Skeleton'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {
  useSearchParamsEnumState,
  useSearchParamsNumericState,
} from '@/lib/hooks/useSearchParamsState'
import {formatTabCount} from '@/lib/utils/common/format'
import Separator from '@/components/ui/Separator'
import {FindingOccurence} from '@/server/db/models'
import {useGetMyFindings} from '@/lib/queries/finding/getMyFinding'
import TablePagination from '@/components/ui/TablePagination'
import {MyFindingsSorting} from '@/lib/types/enums'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'

export const MY_FINDINGS_PAGE_SIZE = 7

const MyFindings = () => {
  const [findingType, {setValue: setFindingType}] = useSearchParamsEnumState(
    'type',
    FindingOccurence,
    FindingOccurence.PRESENT,
  )

  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)
  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(MyFindingsSorting)

  const {data: findings, isLoading} = useGetMyFindings({
    type: findingType,
    pageParams: {
      limit: MY_FINDINGS_PAGE_SIZE,
      offset: (page - 1) * MY_FINDINGS_PAGE_SIZE,
    },
    sort: sortParams,
  })

  const liveFindings = useMemo(
    () =>
      findings?.data.filter(
        (finding) =>
          DateTime.fromJSDate(finding.contest.startDate) < DateTime.now() &&
          DateTime.fromJSDate(finding.contest.endDate) > DateTime.now(),
      ),
    [findings],
  )

  const pastFindings = useMemo(
    () =>
      findings?.data.filter(
        (finding) =>
          DateTime.fromJSDate(finding.contest.endDate) < DateTime.now(),
      ),
    [findings],
  )

  const currentFindings = useMemo(() => {
    switch (findingType) {
      case FindingOccurence.PRESENT:
        return liveFindings
      case FindingOccurence.PAST:
        return pastFindings
    }
  }, [findingType, liveFindings, pastFindings])

  const pastCount = findings?.pageParams.pastCount
  const liveCount = findings?.pageParams.liveCount

  const currentCount = useMemo(() => {
    switch (findingType) {
      case FindingOccurence.PRESENT:
        return liveCount
      case FindingOccurence.PAST:
        return pastCount
    }
  }, [findingType, liveCount, pastCount])

  return (
    <div className="flex flex-grow flex-col">
      <Tabs
        value={findingType}
        onValueChange={setFindingType}
        className="flex flex-grow flex-col">
        <TabsList className="self-start px-24">
          <TabsTrigger
            value={
              FindingOccurence.PRESENT
            }>{`Live${liveCount ? formatTabCount(liveCount) : ''}`}</TabsTrigger>
          <TabsTrigger
            value={
              FindingOccurence.PAST
            }>{`Past${pastCount ? formatTabCount(pastCount) : ''}`}</TabsTrigger>
        </TabsList>
        <Separator />
        <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
          {isLoading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <>
              <MyFindingsTable
                findings={currentFindings}
                sortParams={sortParams}
                updatePageSearchParams={updatePageSearchParams}
                updateSortSearchParams={updateSortSearchParams}
              />
              {!!currentCount && (
                <TablePagination
                  className="mt-12"
                  pageSize={MY_FINDINGS_PAGE_SIZE}
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

export default MyFindings
