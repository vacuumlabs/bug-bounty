'use client'

import {useMemo} from 'react'

import ProjectsOverviewTile from './ProjectsOverviewTile'

import {cn} from '@/lib/utils/client/tailwind'
import {useGetMyContests} from '@/lib/queries/contest/getMyContests'
import {formatAda} from '@/lib/utils/common/format'

type ProjectsRewardsOverviewProps = {
  className?: string
}

const ProjectsRewardsOverview = ({className}: ProjectsRewardsOverviewProps) => {
  const {data} = useGetMyContests({})

  const tiles = useMemo(() => {
    const rewardsPaid = data?.reduce(
      (total, {distributedRewardsAmount}) =>
        total + Number(distributedRewardsAmount),
      0,
    )
    const rewardsOffered = data?.reduce(
      (total, {rewardsAmount}) => total + Number(rewardsAmount),
      0,
    )

    return [
      {
        title: 'Rewards paid (total)',
        amount: rewardsPaid == null ? '-' : formatAda(rewardsPaid, 0),
      },
      {
        title: 'Rewards offered (total)',
        amount: rewardsOffered == null ? '-' : formatAda(rewardsOffered, 0),
      },
    ]
  }, [data])

  return (
    <div className={cn('flex gap-6', className)}>
      {tiles.map((tile, index) => (
        <ProjectsOverviewTile
          key={index}
          title={tile.title}
          value={tile.amount}
        />
      ))}
    </div>
  )
}

export default ProjectsRewardsOverview
