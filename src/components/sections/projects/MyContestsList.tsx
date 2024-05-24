import Link from 'next/link'
import {ArrowRight} from 'lucide-react'

import MyContestsListItem from './MyContestsListItem'

import type {ContestWithFindingCounts} from '@/server/actions/contest/getMyContests'
import {Button} from '@/components/ui/Button'

type MyContestsListProps = {
  contests: ContestWithFindingCounts[] | undefined
}

const MyContestsList = ({contests}: MyContestsListProps) => {
  if (!contests?.length) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center">
        <p className="text-titleL uppercase">There is nothing yet...</p>
        <p className="mb-12 mt-3">Create your first audit</p>
        <Button asChild>
          <Link href="/my-projects/new" className="gap-3">
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
        <MyContestsListItem key={contest.id} contest={contest} />
      ))}
    </div>
  )
}

export default MyContestsList
