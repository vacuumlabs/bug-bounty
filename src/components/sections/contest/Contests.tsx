'use client'

import ContestsTable from './ContestsTable'
import {useSearchParamsContestType} from './utils'

import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useGetPublicContests} from '@/lib/queries/contest/getContests'
import Skeleton from '@/components/ui/Skeleton'
import {ContestOccurence} from '@/server/db/models'
import {useGetPublicContestCounts} from '@/lib/queries/contest/getPublicContestCounts'

const formatCount = (count: number | undefined) =>
  count == null ? '' : ` (${count})`

const Contests = () => {
  const [contestType, setContestType] = useSearchParamsContestType()

  const {data: contests, isLoading} = useGetPublicContests({type: contestType})
  const {data: contestCounts} = useGetPublicContestCounts()

  return (
    <Tabs value={contestType} onValueChange={setContestType}>
      <TabsList className="mb-2">
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
  )
}

export default Contests
