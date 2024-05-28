import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import {useMemo} from 'react'

import ContestStatusBadge from '../contest/ContestStatusBadge'
import ListItemStyledValueText from './ListItemStyledValueText'

import {Button} from '@/components/ui/Button'
import {ContestWithFindingCounts} from '@/server/actions/contest/getMyContests'
import {formatAda} from '@/lib/utils/common/format'

const getRewardPaymentsText = (contest: ContestWithFindingCounts) => {
  if (contest.distributedRewardsAmount == null) {
    return '-'
  }
  if (Number(contest.distributedRewardsAmount) === 0) {
    return 'Transferred back to project'
  }
  return `Sent to ${contest.rewardedAuditorsCount} bug hunters`
}

type MyContestsRewardsListItemProps = {
  contest: ContestWithFindingCounts
}

const MyContestsRewardsListItem = ({
  contest,
}: MyContestsRewardsListItemProps) => {
  const details = useMemo(
    () => [
      {
        label: 'Rewards',
        value: formatAda(contest.rewardsAmount, 0),
      },
      {
        label: 'Paid',
        value:
          contest.distributedRewardsAmount == null
            ? '-'
            : formatAda(contest.distributedRewardsAmount, 0),
      },
      {
        label: 'Reward payments',
        value: getRewardPaymentsText(contest),
      },
    ],
    [contest],
  )

  return (
    <div className="flex flex-col gap-10 bg-grey-90 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-titleL">{contest.title}</span>
          <ContestStatusBadge contest={contest} />
        </div>
        <Button variant="outline" asChild>
          <Link href="#" className="gap-2">
            {'Show details'}
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="flex items-baseline gap-6">
        {details.map((item) => (
          <ListItemStyledValueText key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}

export default MyContestsRewardsListItem
