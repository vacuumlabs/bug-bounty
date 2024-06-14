import {Badge} from '@/components/ui/Badge'
import {cn} from '@/lib/utils/client/tailwind'
import {translateEnum} from '@/lib/utils/common/enums'
import {FindingSeverity} from '@/server/db/models'

const severityToColor = {
  [FindingSeverity.INFO]: 'bg-purple',
  [FindingSeverity.LOW]: 'bg-blue',
  [FindingSeverity.MEDIUM]: 'bg-green',
  [FindingSeverity.HIGH]: 'bg-yellow',
  [FindingSeverity.CRITICAL]: 'bg-red',
}

const MySubmissionSeverityBadge = ({
  severity,
  className,
}: {
  severity: FindingSeverity
  className?: string
}) => {
  return (
    <Badge className={cn(severityToColor[severity], className)}>
      {translateEnum.findingSeverity(severity)}
    </Badge>
  )
}

export default MySubmissionSeverityBadge
