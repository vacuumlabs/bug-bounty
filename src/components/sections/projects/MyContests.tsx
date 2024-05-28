'use client'

import {DateTime} from 'luxon'
import {useMemo} from 'react'

import MyContestsList from './MyContestsList'

import Skeleton from '@/components/ui/Skeleton'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'
import {useGetMyContests} from '@/lib/queries/contest/getMyContests'
import {formatTabCount} from '@/lib/utils/common/format'
import {ContestOccurence} from '@/server/db/models'
import Separator from '@/components/ui/Separator'

const MyContests = () => {
  const [contestType, setContestType] = useSearchParamsEnumState(
    'type',
    ContestOccurence,
    ContestOccurence.PRESENT,
  )

  const {data: contests, isLoading} = useGetMyContests({})

  const liveContests = useMemo(
    () =>
      contests?.filter(
        (contest) =>
          DateTime.fromJSDate(contest.startDate) < DateTime.now() &&
          DateTime.fromJSDate(contest.endDate) > DateTime.now(),
      ),
    [contests],
  )

  const futureContests = useMemo(
    () =>
      contests?.filter(
        (contest) => DateTime.fromJSDate(contest.startDate) > DateTime.now(),
      ),
    [contests],
  )

  const pastContests = useMemo(
    () =>
      contests?.filter(
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

  return (
    <div className="flex flex-grow flex-col">
      <Tabs
        value={contestType}
        onValueChange={setContestType}
        className="flex flex-grow flex-col">
        <TabsList className="self-start px-24">
          <TabsTrigger
            value={
              ContestOccurence.PRESENT
            }>{`Live${formatTabCount(liveContests?.length)}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.PAST
            }>{`Past${formatTabCount(pastContests?.length)}`}</TabsTrigger>
          <TabsTrigger
            value={
              ContestOccurence.FUTURE
            }>{`Future${formatTabCount(futureContests?.length)}`}</TabsTrigger>
        </TabsList>
        <Separator />
        <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-[240px]" />
            </div>
          ) : (
            <MyContestsList contests={currentContests} />
          )}
        </div>
      </Tabs>
    </div>
  )
}

export default MyContests
