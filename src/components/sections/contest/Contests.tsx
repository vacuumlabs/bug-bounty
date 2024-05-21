'use client'

import {useMemo} from 'react'

import ContestsTable from './ContestsTable'
import {useSearchParamsContestType} from './utils'

import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useGetPublicContests} from '@/lib/queries/contest/getContests'
import Skeleton from '@/components/ui/Skeleton'
import {ContestOccurence} from '@/server/db/models'
import {useGetPublicContestCounts} from '@/lib/queries/contest/getPublicContestCounts'
import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'
import TablePagination from '@/components/ui/TablePagination'

const formatCount = (count: number | undefined) =>
  count == null ? '' : ` (${count})`

type ContestsProps = {
  pageSize: number
}

const Contests = ({pageSize}: ContestsProps) => {
  const [contestType, setContestType] = useSearchParamsContestType()
  const [page] = useSearchParamsNumericState('page', 1)

  const {data: contests, isLoading} = useGetPublicContests({
    type: contestType,
    offset: (page - 1) * pageSize,
    limit: pageSize,
  })
  const {data: contestCounts} = useGetPublicContestCounts()

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
        <h3 className="text-3xl font-bold uppercase">Bounties</h3>
      </div>
      <Tabs value={contestType} onValueChange={setContestType}>
        <TabsList className="mb-6">
          <TabsTrigger
            value={
              ContestOccurence.PRESENT
            }>{`Active${formatCount(contestCounts?.present)}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.FUTURE
            }>{`Upcoming${formatCount(contestCounts?.future)}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.PAST
            }>{`Completed${formatCount(contestCounts?.past)}`}</TabsTrigger>
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
