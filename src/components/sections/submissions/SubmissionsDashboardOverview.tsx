'use client'

import {useMemo} from 'react'

import SubmissionsOverviewTile from './SubmissionsOverviewTile'

import {cn} from '@/lib/utils/client/tailwind'
import {useGetMyFindingsCounts} from '@/lib/queries/finding/getMyFindingsCounts'
import {formatAda} from '@/lib/utils/common/format'

type SubmissionsDashboardOverviewProps = {
  className?: string
}

const SubmissionsDashboardOverview = ({
  className,
}: SubmissionsDashboardOverviewProps) => {
  const {data} = useGetMyFindingsCounts()

  const tiles = useMemo(
    () => [
      {
        title: 'Submitted reports',
        count: data?.total ?? '-',
      },
      {
        title: 'Reports in review',
        count: data?.inReview ?? '-',
      },
      {
        title: 'Confirmed reports',
        count: data?.confirmed ?? '-',
      },
      {
        title: 'Rewards received',
        count: data?.totalRewardsValue
          ? formatAda(data.totalRewardsValue)
          : '-',
      },
    ],
    [data],
  )

  return (
    <div className={cn('flex gap-6', className)}>
      {tiles.map((tile, index) => (
        <SubmissionsOverviewTile
          key={index}
          title={tile.title}
          value={tile.count}
        />
      ))}
    </div>
  )
}

export default SubmissionsDashboardOverview
