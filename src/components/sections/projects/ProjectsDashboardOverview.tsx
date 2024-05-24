'use client'

import {useMemo} from 'react'

import {cn} from '@/lib/utils/client/tailwind'
import {useGetMyContestsReportCounts} from '@/lib/queries/contest/getMyContestsReportCounts'

type ProjectsDashboardOverviewProps = {
  className?: string
}

const ProjectsDashboardOverview = ({
  className,
}: ProjectsDashboardOverviewProps) => {
  const {data} = useGetMyContestsReportCounts()

  const cards = useMemo(
    () => [
      {
        label: 'Total received reports',
        count: data?.total ?? '-',
      },
      {
        label: 'Open reports',
        count: data?.open ?? '-',
      },
      {
        label: 'Approved reports',
        count: data?.approved ?? '-',
      },
      {
        label: 'Rejected reports',
        count: data?.rejected ?? '-',
      },
      {
        label: 'Unique reports',
        count: data?.unique ?? '-',
      },
    ],
    [data],
  )

  return (
    <div className={cn('flex gap-6', className)}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex basis-1/5 flex-col gap-4 bg-grey-90 p-6">
          <p className="text-titleM">{card.label}</p>
          <p className="text-headlineS">{card.count}</p>
        </div>
      ))}
    </div>
  )
}

export default ProjectsDashboardOverview
