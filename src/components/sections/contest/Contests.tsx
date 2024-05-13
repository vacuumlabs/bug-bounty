'use client'

import ContestsTable from './ContestsTable'
import {useSearchParamsContestType} from './utils'

import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useGetPublicContests} from '@/lib/queries/contest/getContests'
import Skeleton from '@/components/ui/Skeleton'

const Contests = () => {
  const [contestType, setContestType] = useSearchParamsContestType()

  const {data, isLoading} = useGetPublicContests({type: contestType})

  return (
    <Tabs value={contestType} onValueChange={setContestType}>
      <TabsList className="mb-2">
        <TabsTrigger value="current">Active</TabsTrigger>
        <TabsTrigger value="future">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Completed</TabsTrigger>
      </TabsList>
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[60px]" />
          <Skeleton className="h-[60px]" />
          <Skeleton className="h-[60px]" />
        </div>
      ) : (
        <ContestsTable contests={data ?? []} />
      )}
    </Tabs>
  )
}

export default Contests
