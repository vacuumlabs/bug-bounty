'use client'

import {useMemo} from 'react'

import ContestsTable from './ContestsTable'

import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useGetPublicContests} from '@/lib/queries/contest/getPublicContests'
import Skeleton from '@/components/ui/Skeleton'
import {
  ContestOccurence,
  ProjectCategory,
  ProjectLanguage,
} from '@/server/db/models'
import {useGetPublicContestCounts} from '@/lib/queries/contest/getPublicContestCounts'
import {
  mergeSearchParamsUpdaters,
  useSearchParamsEnumArrayState,
  useSearchParamsEnumState,
  useSearchParamsNumericState,
  useUpdateSearchParams,
} from '@/lib/hooks/useSearchParamsState'
import TablePagination from '@/components/ui/TablePagination'
import {formatTabCount} from '@/lib/utils/common/format'
import Anchor from '@/components/ui/Anchor'
import {selectOptions} from '@/lib/utils/common/enums'
import {Filter, FilterControls, SortControls} from '@/components/ui/Filter'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {contestSortOptions} from '@/lib/utils/common/sorting'
import {ContestSorting} from '@/lib/types/enums'

type ContestsProps = {
  pageSize: number
}

const Contests = ({pageSize}: ContestsProps) => {
  const updateSearchParams = useUpdateSearchParams()

  const [contestType, {getSearchParamsUpdater: updateContestTypeSearchParams}] =
    useSearchParamsEnumState('type', ContestOccurence, ContestOccurence.PRESENT)

  const [
    projectCategory,
    {getSearchParamsUpdater: updateCategorySearchParams},
  ] = useSearchParamsEnumArrayState('category', ProjectCategory)

  const [
    projectLanguage,
    {getSearchParamsUpdater: updateLanguageSearchParams},
  ] = useSearchParamsEnumArrayState('language', ProjectLanguage)

  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)

  const [sortParams, setSortParams] = useSortingSearchParams(ContestSorting)

  const {data: contests, isLoading} = useGetPublicContests({
    type: contestType,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    projectCategory,
    projectLanguage,
    sort: sortParams,
  })
  const {data: contestCounts} = useGetPublicContestCounts({
    projectCategory,
    projectLanguage,
  })

  const currentTotalCount = useMemo(() => {
    switch (contestType) {
      case ContestOccurence.PRESENT:
        return contestCounts?.present
      case ContestOccurence.FUTURE:
        return contestCounts?.future
      case ContestOccurence.PAST:
        return contestCounts?.past
    }
  }, [contestCounts, contestType])

  const filters: Filter[] = useMemo(
    () => [
      {
        label: 'Project type',
        values: projectCategory,
        getSearchParamsUpdater: (newValue) =>
          mergeSearchParamsUpdaters([
            updatePageSearchParams(null),
            updateCategorySearchParams(newValue),
          ]),
        options: selectOptions.projectCategory,
      },
      {
        label: 'Language',
        values: projectLanguage,
        getSearchParamsUpdater: (newValue) =>
          mergeSearchParamsUpdaters([
            updatePageSearchParams(null),
            updateLanguageSearchParams(newValue),
          ]),
        options: selectOptions.projectLanguage,
      },
    ],
    [
      projectCategory,
      projectLanguage,
      updateCategorySearchParams,
      updateLanguageSearchParams,
      updatePageSearchParams,
    ],
  )

  const onContestTypeChange = (value: ContestOccurence) => {
    updateSearchParams([
      updatePageSearchParams(null),
      updateContestTypeSearchParams(value),
    ])
  }

  return (
    <div className="flex flex-col">
      <Anchor id="contests" />
      <div className="mb-11 flex items-center justify-between">
        <h3 className="text-headlineM font-bold uppercase">Bounties</h3>
        <div className="flex gap-3">
          <FilterControls filters={filters} />
          <SortControls
            options={contestSortOptions}
            sortParams={sortParams}
            setSortParams={setSortParams}
          />
        </div>
      </div>
      <Tabs value={contestType} onValueChange={onContestTypeChange}>
        <TabsList className="mb-6">
          <TabsTrigger
            className="text-bodyS"
            value={
              ContestOccurence.PRESENT
            }>{`Active${formatTabCount(contestCounts?.present)}`}</TabsTrigger>
          <TabsTrigger
            className="text-bodyS"
            value={
              ContestOccurence.FUTURE
            }>{`Upcoming${formatTabCount(contestCounts?.future)}`}</TabsTrigger>
          <TabsTrigger
            className="text-bodyS"
            value={
              ContestOccurence.PAST
            }>{`Completed${formatTabCount(contestCounts?.past)}`}</TabsTrigger>
        </TabsList>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
            <Skeleton className="h-[60px]" />
          </div>
        ) : (
          <ContestsTable contestType={contestType} contests={contests ?? []} />
        )}
      </Tabs>
      {!!currentTotalCount && (
        <TablePagination
          className="mt-11"
          pageSize={pageSize}
          totalCount={currentTotalCount}
        />
      )}
    </div>
  )
}

export default Contests
