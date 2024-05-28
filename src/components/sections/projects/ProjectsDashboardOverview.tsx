'use client'

import {useMemo} from 'react'

import ProjectsOverviewTile from './ProjectsOverviewTile'

import {cn} from '@/lib/utils/client/tailwind'
import {useGetMyContestsReportCounts} from '@/lib/queries/contest/getMyContestsReportCounts'

type ProjectsDashboardOverviewProps = {
  className?: string
}

const ProjectsDashboardOverview = ({
  className,
}: ProjectsDashboardOverviewProps) => {
  const {data} = useGetMyContestsReportCounts()

  const tiles = useMemo(
    () => [
      {
        title: 'Total received reports',
        count: data?.total ?? '-',
      },
      {
        title: 'Open reports',
        count: data?.open ?? '-',
      },
      {
        title: 'Approved reports',
        count: data?.approved ?? '-',
      },
      {
        title: 'Rejected reports',
        count: data?.rejected ?? '-',
      },
      {
        title: 'Unique reports',
        count: data?.unique ?? '-',
      },
    ],
    [data],
  )

  return (
    <div className={cn('flex gap-6', className)}>
      {tiles.map((tile, index) => (
        <ProjectsOverviewTile
          key={index}
          title={tile.title}
          value={tile.count}
        />
      ))}
    </div>
  )
}

export default ProjectsDashboardOverview
