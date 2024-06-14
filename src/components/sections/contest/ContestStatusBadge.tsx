import {useMemo} from 'react'

import {Contest} from '@/server/db/schema/contest'
import {cn} from '@/lib/utils/client/tailwind'
import {Badge} from '@/components/ui/Badge'
import {getContestStatus} from '@/lib/utils/common/contest'

type BadgeStatus =
  | 'draft'
  | 'inReview'
  | 'pending'
  | 'rejected'
  | 'approved'
  | 'notApproved'
  | 'live'
  | 'judging'
  | 'finished'

const contestStatusTexts: Record<BadgeStatus, string> = {
  draft: 'Draft',
  inReview: 'In Review',
  pending: 'Pending',
  rejected: 'Rejected',
  approved: 'Approved',
  notApproved: 'Not Approved',
  live: 'Live',
  judging: 'Judging',
  finished: 'Finished',
}

const backgroundColorMap = {
  draft: 'bg-grey-40',
  inReview: 'bg-yellow-light',
  pending: 'bg-yellow',
  rejected: 'bg-red',
  approved: 'bg-green-light',
  notApproved: 'bg-red-light',
  live: 'bg-green',
  judging: 'bg-blue',
  finished: 'bg-purple',
} satisfies Record<BadgeStatus, string>

type ContestStatusBadgeProps = {
  contest: Pick<Contest, 'endDate' | 'startDate' | 'status'>
  className?: string
}

const ContestStatusBadge = ({contest, className}: ContestStatusBadgeProps) => {
  const badgeStatus: BadgeStatus = useMemo(
    () => getContestStatus({...contest}),
    [contest],
  )

  return (
    <Badge className={cn(backgroundColorMap[badgeStatus], className)}>
      {contestStatusTexts[badgeStatus]}
    </Badge>
  )
}

export default ContestStatusBadge
