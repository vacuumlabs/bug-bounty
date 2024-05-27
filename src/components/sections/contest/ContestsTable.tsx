import Link from 'next/link'

import ContestsTableRow from './ContestsTableRow'

import {ContestOccurence} from '@/server/db/models'
import {Contest} from '@/server/db/schema/contest'
import {Button} from '@/components/ui/Button'
import {DISCORD_URL} from '@/lib/utils/common/paths'

const texts = {
  [ContestOccurence.PRESENT]: {
    title: 'No active bounties at this moment...',
    description:
      'Explore upcoming and completed bounties or join our community.',
  },
  [ContestOccurence.PAST]: {
    title: 'No past bounties...',
    description: 'Explore upcoming and live bounties or join our community.',
  },
  [ContestOccurence.FUTURE]: {
    title: 'No future bounties at this moment...',
    description: 'Explore past and live bounties or join our community.',
  },
}

type ContestsTableProps = {
  contests: Contest[]
  contestType: ContestOccurence
}

const ContestsTable = ({contests, contestType}: ContestsTableProps) => {
  if (contests.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center">
        <p className="text-center text-titleL uppercase">
          {texts[contestType].title}
        </p>
        <p className="mb-6 mt-3 text-center text-bodyM">
          {texts[contestType].description}
        </p>
        <Button asChild>
          <Link href={DISCORD_URL} target="_blank">
            Join the community
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <table className="w-full">
      <tbody className="flex flex-col gap-3">
        {contests.map((contest) => (
          <ContestsTableRow key={contest.id} contest={contest} />
        ))}
      </tbody>
    </table>
  )
}

export default ContestsTable
