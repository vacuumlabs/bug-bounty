import {useMemo} from 'react'

import {Contest} from '@/server/db/schema/contest'
import {cn} from '@/lib/utils/client/tailwind'
import {Badge} from '@/components/ui/Badge'
import {getContestStatusText} from '@/lib/utils/common/contest'
import {ContestStatusText} from '@/lib/types/enums'
import {translateEnum} from '@/lib/utils/common/enums'

const backgroundColorMap = {
  [ContestStatusText.draft]: 'bg-grey-40',
  [ContestStatusText.inReview]: 'bg-yellow-light',
  [ContestStatusText.pending]: 'bg-yellow',
  [ContestStatusText.rejected]: 'bg-red',
  [ContestStatusText.approved]: 'bg-green-light',
  [ContestStatusText.notApproved]: 'bg-red-light',
  [ContestStatusText.live]: 'bg-green',
  [ContestStatusText.judging]: 'bg-blue',
  [ContestStatusText.finished]: 'bg-purple',
} satisfies Record<ContestStatusText, string>

type ContestStatusBadgeProps = {
  contest: Pick<Contest, 'endDate' | 'startDate' | 'status'>
  className?: string
}

const ContestStatusBadge = ({contest, className}: ContestStatusBadgeProps) => {
  const badgeStatus: ContestStatusText = useMemo(
    () => getContestStatusText(contest),
    [contest],
  )

  return (
    <Badge className={cn(backgroundColorMap[badgeStatus], className)}>
      {translateEnum.contestStatusText(badgeStatus)}
    </Badge>
  )
}

export default ContestStatusBadge
