import Link from 'next/link'
import {VariantProps} from 'class-variance-authority'
import {DateTime} from 'luxon'
import {ArrowRight} from 'lucide-react'

import {useSearchParamsContestType} from './utils'

import {Button} from '@/components/ui/Button'
import {Contest} from '@/server/db/schema/contest'
import {formatAda} from '@/lib/utils/common/format'
import {ContestOccurence} from '@/server/db/models'
import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import cardanoLogo from '@public/images/cardano-logo.png'
import {Badge, badgeVariants} from '@/components/ui/Badge'

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

const badgeVariantsMap: Record<
  ContestOccurence,
  VariantProps<typeof badgeVariants>['variant']
> = {
  [ContestOccurence.PRESENT]: 'green',
  [ContestOccurence.FUTURE]: 'sky',
  [ContestOccurence.PAST]: 'blue',
}

const ContestsTableRow = ({contest}: ContestsTableRowProps) => {
  const [contestType] = useSearchParamsContestType()

  return (
    <tr key={contest.id} className="bg-white-5 flex items-center gap-4 p-4">
      <td>
        <Avatar>
          <AvatarImage src={cardanoLogo.src} />
        </Avatar>
      </td>
      <td className="flex-grow text-xl font-semibold">{contest.title}</td>
      <td className="flex items-center justify-end gap-3">
        <Badge variant={badgeVariantsMap[contestType]}>
          {contestStatusTexts[contestType]}
        </Badge>
      </td>
      <td className="flex w-[15%] items-baseline justify-center">
        <span className="text-white-70 whitespace-pre">{`${timeTexts[contestType]} `}</span>
        <span className="font-semibold">
          {DateTime.fromJSDate(contest.endDate).toRelative({locale: 'en'})}
        </span>
      </td>
      <td className="flex w-[15%] items-baseline justify-center">
        <span className="text-white-70 whitespace-pre">{'Rewards:  '}</span>
        <span className="font-semibold">
          {formatAda(contest.rewardsAmount)}
        </span>
      </td>
      <td>
        <Button variant="outline" asChild className="text-sm normal-case">
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
