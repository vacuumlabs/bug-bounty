'use client'

import {useMemo} from 'react'
import {useSearchParams} from 'next/navigation'

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
  SearchParamsUpdater,
  usePushUpdatedSearchParams,
  useSearchParamsEnumArrayState,
  useSearchParamsEnumState,
  useSearchParamsNumericState,
} from '@/lib/hooks/useSearchParamsState'
import TablePagination from '@/components/ui/TablePagination'
import {formatTabCount} from '@/lib/utils/common/format'
import Anchor from '@/components/ui/Anchor'
import {selectOptions} from '@/lib/utils/common/enums'
import {FilterControls} from '@/components/ui/Filter'
import {Filter} from '@/components/ui/Filter/FilterControls'

const withPageReset =
  <T,>(updater: SearchParamsUpdater<T>): SearchParamsUpdater<T> =>
  (params, value) => {
    const updatedParams = updater(params, value)
    updatedParams.delete('page')
    return updatedParams
  }

type ContestsProps = {
  pageSize: number
}

const Contests = ({pageSize}: ContestsProps) => {
  const searchParams = useSearchParams()
  const pushUpdatedSearchParams = usePushUpdatedSearchParams()

  const [contestType, {getUpdatedSearchParams: updateContestTypeSearchParams}] =
    useSearchParamsEnumState('type', ContestOccurence, ContestOccurence.PRESENT)
  const [
    projectCategory,
    {getUpdatedSearchParams: updateCategorySearchParams},
  ] = useSearchParamsEnumArrayState('category', ProjectCategory)
  const [
    projectLanguage,
    {getUpdatedSearchParams: updateLanguageSearchParams},
  ] = useSearchParamsEnumArrayState('language', ProjectLanguage)
  const [page] = useSearchParamsNumericState('page', 1)

  const {data: contests, isLoading} = useGetPublicContests({
    type: contestType,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    projectCategory,
    projectLanguage,
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
        updateSearchParams: withPageReset(updateCategorySearchParams),
        options: selectOptions.projectCategory,
      },
      {
        label: 'Language',
        values: projectLanguage,
        updateSearchParams: withPageReset(updateLanguageSearchParams),
        options: selectOptions.projectLanguage,
      },
    ],
    [
      projectCategory,
      projectLanguage,
      updateCategorySearchParams,
      updateLanguageSearchParams,
    ],
  )

  const onContestTypeChange = (value: ContestOccurence) => {
    const currentSearchParams = new URLSearchParams(searchParams.toString())
    const updateSearchParams = withPageReset(updateContestTypeSearchParams)

    pushUpdatedSearchParams(updateSearchParams(currentSearchParams, value))
  }

  return (
    <div className="flex flex-col">
      <Anchor id="contests" />
      <div className="mb-11 flex items-center justify-between">
        <h3 className="text-headlineM font-bold uppercase">Bounties</h3>
        <FilterControls filters={filters} />
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
