import {ArrowRight} from 'lucide-react'
import Link from 'next/link'

import MyContestsRewardsListItem from './MyContestsRewardsListItem'

import {Button} from '@/components/ui/Button'
import {PATHS} from '@/lib/utils/common/paths'
import type {ContestWithFindingCounts} from '@/server/actions/contest/getMyContests'

type MyContestsRewardsListProps = {
  contests: ContestWithFindingCounts[] | undefined
}

const MyContestsRewardsList = ({contests}: MyContestsRewardsListProps) => {
  if (!contests?.length) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center">
        <p className="mb-12 text-titleL uppercase">There is nothing yet...</p>
        <Button asChild>
          <Link href={PATHS.newProject} className="gap-3">
            Create audit
            <ArrowRight />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {contests.map((contest) => (
        <MyContestsRewardsListItem key={contest.id} contest={contest} />
      ))}
    </div>
  )
}

export default MyContestsRewardsList
