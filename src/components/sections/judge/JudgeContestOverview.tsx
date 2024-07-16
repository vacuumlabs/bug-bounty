'use client'

import {useMemo} from 'react'

import JudgeContestOverviewTile from './JudgeContestOverviewTile'

import {cn} from '@/lib/utils/client/tailwind'
import {useGetJudgeContestCounts} from '@/lib/queries/contest/getJudgeContestCounts'

type JudgeContestOverviewProps = {
  className?: string
}

const JudgeContestOverview = ({className}: JudgeContestOverviewProps) => {
  const {data} = useGetJudgeContestCounts()

  const tiles = useMemo(
    () => [
      {
        title: 'To review',
        count: data?.toReview ?? '-',
      },
      {
        title: 'To judge',
        count: data?.toJudge ?? '-',
      },
      {
        title: 'To reward',
        count: data?.toReward ?? '-',
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

export default JudgeContestOverview
