'use client'

import MyContestsRewardsList from './MyContestsRewardsList'

import Skeleton from '@/components/ui/Skeleton'
import {useGetMyContests} from '@/lib/queries/contest/getMyContests'

const MyContestsRewards = () => {
  const {data: contests, isLoading} = useGetMyContests({})

  return (
    <div className="flex flex-grow flex-col gap-6 bg-black px-24 pb-24 pt-12">
      <h2 className="text-titleM">
        {isLoading
          ? 'Project rewards'
          : `Project rewards (${contests?.length ?? 0})`}
      </h2>
      {isLoading ? (
        <Skeleton className="h-[240px]" />
      ) : (
        <MyContestsRewardsList contests={contests} />
      )}
    </div>
  )
}

export default MyContestsRewards
