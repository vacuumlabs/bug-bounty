import Link from 'next/link'
import {cva} from 'class-variance-authority'
import {DateTime} from 'luxon'

import {useSearchParamsContestType} from './utils'

import {Button} from '@/components/ui/Button'
import {Contest} from '@/server/db/schema/contest'
import {formatAda} from '@/lib/utils/common/format'
import {cn} from '@/lib/utils/client/tailwind'
import {ContestOccurence} from '@/server/db/models'

type ContestsTableRowProps = {
  contest: Contest
}

const contestStatusTexts: Record<string, string> = {
  [ContestOccurence.PRESENT]: 'Live',
  [ContestOccurence.FUTURE]: 'Upcoming',
  [ContestOccurence.PAST]: 'Completed',
}

const timeTexts = {
  [ContestOccurence.PRESENT]: 'Ends ',
  [ContestOccurence.FUTURE]: 'Starts ',
  [ContestOccurence.PAST]: 'Ended ',
}

const indicatorVariants = cva('h-4 w-4 rounded-full', {
  variants: {
    type: {
      [ContestOccurence.PRESENT]: 'bg-lime-500',
      [ContestOccurence.FUTURE]: 'bg-cyan-500',
      [ContestOccurence.PAST]: 'bg-fuchsia-500',
    },
  },
})

const ContestsTableRow = ({contest}: ContestsTableRowProps) => {
  const [contestType] = useSearchParamsContestType()

  return (
    <tr
      key={contest.id}
      className="flex items-center gap-10 bg-white px-8 py-4">
      <td className="flex-grow font-semibold">{contest.title}</td>
      <td className="flex items-center gap-3">
        <div className={cn(indicatorVariants({type: contestType}))} />
        <span className="font-semibold">{contestStatusTexts[contestType]}</span>
      </td>
      <td className="flex items-baseline justify-center gap-1.5">
        <span className="text-sm">{timeTexts[contestType]}</span>
        <span className="font-semibold">
          {DateTime.fromJSDate(contest.endDate).toRelative({locale: 'en'})}
        </span>
      </td>
      <td className="flex items-baseline justify-center gap-4">
        <span className="text-sm">Rewards</span>
        <span className="font-semibold">
          {formatAda(contest.rewardsAmount)}
        </span>
      </td>
      <td>
        <Button variant="outline" asChild>
          <Link href={`/contests/${contest.id}`}>View Audit</Link>
        </Button>
      </td>
    </tr>
  )
}

export default ContestsTableRow
