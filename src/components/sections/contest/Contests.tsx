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
  useSearchParamsEnumArrayState,
  useSearchParamsEnumState,
  useSearchParamsNumericState,
} from '@/lib/hooks/useSearchParamsState'
import TablePagination from '@/components/ui/TablePagination'
import {formatTabCount} from '@/lib/utils/common/format'

type ContestsProps = {
  pageSize: number
}

const Contests = ({pageSize}: ContestsProps) => {
  const [contestType, setContestType] = useSearchParamsEnumState(
    'type',
    ContestOccurence,
    ContestOccurence.PRESENT,
  )
  const [projectCategory] = useSearchParamsEnumArrayState(
    'category',
    ProjectCategory,
  )
  const [projectLanguage] = useSearchParamsEnumArrayState(
    'language',
    ProjectLanguage,
  )
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

  return (
    <div className="flex flex-col">
      <div className="mb-11 flex items-center justify-between">
        <h3 className="text-headlineL font-bold uppercase">Bounties</h3>
      </div>
      <Tabs value={contestType} onValueChange={setContestType}>
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
          <ContestsTable contests={contests ?? []} />
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
