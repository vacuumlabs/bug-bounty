import {cn} from '@/lib/utils/client/tailwind'
import {FindingSeverity} from '@/server/db/models'

const severityToColor = {
  [FindingSeverity.INFO]: 'bg-purple',
  [FindingSeverity.LOW]: 'bg-blue',
  [FindingSeverity.MEDIUM]: 'bg-green',
  [FindingSeverity.HIGH]: 'bg-yellow',
  [FindingSeverity.CRITICAL]: 'bg-red',
}

const MySubmissionSeverityBadge = ({severity}: {severity: FindingSeverity}) => {
  return (
    <span
      className={cn(
        'h-6 w-12 rounded-[40px] px-3 py-1 text-buttonS capitalize text-black',
        severityToColor[severity],
      )}>
      {severity.valueOf()}
    </span>
  )
}

export default MySubmissionSeverityBadge
