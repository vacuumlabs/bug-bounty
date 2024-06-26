'use client'

import {notFound} from 'next/navigation'

import ContestDetailBody from './ContestDetailBody'
import ContestOverview from './ContestOverview'

import {useGetContest} from '@/lib/queries/contest/getContest'
import Skeleton from '@/components/ui/Skeleton'
import Separator from '@/components/ui/Separator'

type ContestDetailsProps = {
  contestId: string
}

const ContestDetails = ({contestId}: ContestDetailsProps) => {
  const {data: contest, isLoading} = useGetContest(contestId)

  if (isLoading) {
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

  if (!contest) {
    return notFound()
  }

  return (
    <>
      <ContestOverview contest={contest} />
      <ContestDetailBody contest={contest} />
    </>
  )
}

export default ContestDetails
