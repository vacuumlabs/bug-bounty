import {cn} from '@/lib/utils/client/tailwind'

type SubmissionsOverviewTileProps = {
  title: string
  value: string | number
  className?: string
}

const SubmissionsOverviewTile = ({
  title,
  value,
  className,
}: SubmissionsOverviewTileProps) => {
  return (
    <div className={cn('flex flex-1 flex-col gap-4 bg-grey-90 p-6', className)}>
      <p className="text-titleM">{title}</p>
      <p className="text-headlineS">{value}</p>
    </div>
  )
}

export default SubmissionsOverviewTile
