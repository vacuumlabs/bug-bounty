'use client'

import {notFound} from 'next/navigation'

import ContestOverview from '../contest/ContestDetails/ContestOverview'
import MyProjectDetailsBody from './MyProjectDetailsBody'

import Skeleton from '@/components/ui/Skeleton'
import {useGetContest} from '@/lib/queries/contest/getContest'
import Separator from '@/components/ui/Separator'
import {useGetDeduplicatedFindingsCount} from '@/lib/queries/deduplicatedFinding/getDeduplicatedFinding'

type MyProjectDetailsProps = {
  contestId: string
}

const MyProjectDetails = ({contestId}: MyProjectDetailsProps) => {
  const {data: contest, isLoading: contestLoading} = useGetContest(contestId)
  const {
    data: deduplicatedFindingsCount,
    isLoading: deduplicatedFindingsCountLoading,
  } = useGetDeduplicatedFindingsCount(contestId)

  if (contestLoading || deduplicatedFindingsCountLoading) {
    return (
      <div>
        <div className="flex gap-6 px-24">
          <Skeleton className="h-[296px]" />
          <Skeleton className="h-[296px]" />
          <Skeleton className="h-[296px]" />
        </div>
        <Separator className="mt-12" />
        <div className="mt-12 flex w-full flex-col gap-12 px-24 xl:px-[340px]">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!contest || !deduplicatedFindingsCount) {
    return notFound()
  }

  return (
    <>
      <ContestOverview
        contest={contest}
        myProject={{
          vulnerabilitiesCount: deduplicatedFindingsCount.count,
        }}
      />
      <MyProjectDetailsBody contest={contest} />
    </>
  )
}

export default MyProjectDetails
