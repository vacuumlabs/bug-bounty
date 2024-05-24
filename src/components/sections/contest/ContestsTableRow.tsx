import Link from 'next/link'
import {DateTime} from 'luxon'
import {ArrowRight} from 'lucide-react'

import ContestStatusBadge from './ContestStatusBadge'

import {Button} from '@/components/ui/Button'
import {Contest} from '@/server/db/schema/contest'
import {formatAda} from '@/lib/utils/common/format'
import {ContestOccurence} from '@/server/db/models'
import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import cardanoLogo from '@public/images/cardano-logo.png'
import {useSearchParamsEnumState} from '@/lib/hooks/useSearchParamsState'

type ContestsTableRowProps = {
  contest: Contest
}

const timeTexts = {
  [ContestOccurence.PRESENT]: 'Ends ',
  [ContestOccurence.FUTURE]: 'Starts ',
  [ContestOccurence.PAST]: 'Ended ',
}

const ContestsTableRow = ({contest}: ContestsTableRowProps) => {
  const [contestType] = useSearchParamsEnumState(
    'type',
    ContestOccurence,
    ContestOccurence.PRESENT,
  )

  return (
    <tr key={contest.id} className="flex items-center gap-4 bg-white/5 p-4">
      <td>
        <Avatar>
          <AvatarImage src={cardanoLogo.src} />
        </Avatar>
      </td>
      <td className="flex-grow text-buttonL font-semibold">{contest.title}</td>
      <td className="flex items-center justify-end gap-3">
        <ContestStatusBadge contest={contest} />
      </td>
      <td className="flex w-[15%] items-baseline justify-center">
        <span className="whitespace-pre text-white/70">{`${timeTexts[contestType]} `}</span>
        <span className="font-semibold">
          {DateTime.fromJSDate(contest.endDate).toRelative({locale: 'en'})}
        </span>
      </td>
      <td className="flex w-[15%] items-baseline justify-center">
        <span className="whitespace-pre text-white/70">{'Rewards:  '}</span>
        <span className="font-semibold">
          {formatAda(contest.rewardsAmount)}
        </span>
      </td>
      <td>
        <Button variant="outline" asChild size="small" className="normal-case">
          <Link className="gap-2" href={`/contests/${contest.id}`}>
            View Audit
            <ArrowRight size={16} />
          </Link>
        </Button>
      </td>
    </tr>
  )
}

export default ContestsTableRow
