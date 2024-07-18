'use client'

import {useMemo} from 'react'

import JudgeContestOverviewTile from './JudgeContestOverviewTile'

import {cn} from '@/lib/utils/client/tailwind'
import {useGetJudgeRewardCounts} from '@/lib/queries/reward/getJudgeRewardCounts'

type JudgeRewardOverviewProps = {
  className?: string
}

const JudgeRewardOverview = ({className}: JudgeRewardOverviewProps) => {
  const {data} = useGetJudgeRewardCounts()

  const tiles = useMemo(
    () => [
      {
        title: 'Contests to payout',
        count: data?.contestsToPayoutCount ?? '-',
      },
      {
        title: 'Individuals to payout',
        count: data?.individualsToPayout ?? '-',
      },
      {
        title: 'Amount to payout',
        count: data?.contestsToPayoutAmount ?? '-',
      },
      {
        title: 'Pending contests',
        count: data?.pendingContests ?? '-',
      },
    ],
    [data],
  )

  return (
    <div className={cn('flex gap-6', className)}>
      {tiles.map((tile, index) => (
        <JudgeContestOverviewTile
          key={index}
          title={tile.title}
          value={tile.count}
        />
      ))}
    </div>
  )
}

export default JudgeRewardOverview
