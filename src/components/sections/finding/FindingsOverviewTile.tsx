import {cn} from '@/lib/utils/client/tailwind'

type FindingsOverviewTileProps = {
  title: string
  value: string | number
  className?: string
}

const FindingsOverviewTile = ({
  title,
  value,
  className,
}: FindingsOverviewTileProps) => {
  return (
    <div className={cn('flex flex-1 flex-col gap-4 bg-grey-90 p-6', className)}>
      <p className="text-titleM">{title}</p>
      <p className="text-headlineS">{value}</p>
    </div>
  )
}

export default FindingsOverviewTile
