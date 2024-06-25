type ContestSeverityWeightsProps = {
  info: number | undefined
  low: number | undefined
  medium: number | undefined
  high: number | undefined
  critical: number | undefined
}

const ContestSeverityWeightsDisplay = ({
  info,
  low,
  medium,
  high,
  critical,
}: ContestSeverityWeightsProps) => {
  return (
    <div className="flex gap-6">
      <div className="inline-block">
        <span className="text-bodyM capitalize text-grey-30">info: </span>
        <span className="text-bodyM text-white">{info ?? '-'}</span>
      </div>
      <div className="h-6 w-[1px] bg-white" />
      <div className="inline-block">
        <span className="text-bodyM capitalize text-grey-30">low: </span>
        <span className="text-bodyM text-white">{low ?? '-'}</span>
      </div>
      <div className="h-6 w-[1px] bg-white" />
      <div className="inline-block">
        <span className="text-bodyM capitalize text-grey-30">medium: </span>
        <span className="text-bodyM text-white">{medium ?? '-'}</span>
      </div>
      <div className="h-6 w-[1px] bg-white" />
      <div className="inline-block">
        <span className="text-bodyM capitalize text-grey-30">high: </span>
        <span className="text-bodyM text-white">{high ?? '-'}</span>
      </div>
      <div className="h-6 w-[1px] bg-white" />
      <div className="inline-block">
        <span className="text-bodyM capitalize text-grey-30">critical: </span>
        <span className="text-bodyM text-white">{critical ?? '-'}</span>
      </div>
    </div>
  )
}

export default ContestSeverityWeightsDisplay
