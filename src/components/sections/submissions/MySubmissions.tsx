'use client'

import {DateTime} from 'luxon'
import {useMemo} from 'react'

import MySubmissionsTable from './MySubmissionsTable'

import Skeleton from '@/components/ui/Skeleton'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'
import {formatTabCount} from '@/lib/utils/common/format'
import Separator from '@/components/ui/Separator'
import {FindingOccurence} from '@/server/db/models'
import {useGetMyFindings} from '@/lib/queries/finding/getMyFinding'

const MySubmissions = () => {
  const [findingType, {setValue: setFindingType}] = useSearchParamsEnumState(
    'type',
    FindingOccurence,
    FindingOccurence.PRESENT,
  )

  const {data: findings, isLoading} = useGetMyFindings({})

  const liveFindings = useMemo(
    () =>
      findings?.filter(
        (finding) =>
          DateTime.fromJSDate(finding.contest.startDate) < DateTime.now() &&
          DateTime.fromJSDate(finding.contest.endDate) > DateTime.now(),
      ),
    [findings],
  )

  const pastFindings = useMemo(
    () =>
      findings?.filter(
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
            }>{`Live${formatTabCount(liveFindings?.length)}`}</TabsTrigger>
          <TabsTrigger
            value={
              FindingOccurence.PAST
            }>{`Past${formatTabCount(pastFindings?.length)}`}</TabsTrigger>
        </TabsList>
        <Separator />
        <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
          {isLoading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <MySubmissionsTable findings={currentFindings} />
          )}
        </div>
      </Tabs>
    </div>
  )
}

export default MySubmissions
