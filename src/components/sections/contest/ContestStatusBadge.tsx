import {useMemo} from 'react'
import {DateTime} from 'luxon'

import {ContestStatus} from '@/server/db/models'
import {Contest} from '@/server/db/schema/contest'
import {cn} from '@/lib/utils/client/tailwind'
import {Badge} from '@/components/ui/Badge'

type BadgeStatus =
  | 'draft'
  | 'inReview'
  | 'pending'
  | 'rejected'
  | 'approved'
  | 'live'
  | 'judging'
  | 'finished'

const contestStatusTexts: Record<BadgeStatus, string> = {
  draft: 'Draft',
  inReview: 'In Review',
  pending: 'Pending',
  rejected: 'Rejected',
  approved: 'Approved',
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
  live: 'bg-green',
  judging: 'bg-blue',
  finished: 'bg-purple',
} satisfies Record<BadgeStatus, string>

type ContestStatusBadgeProps = {
  contest: Pick<Contest, 'endDate' | 'startDate' | 'status'>
  className?: string
}

const ContestStatusBadge = ({contest, className}: ContestStatusBadgeProps) => {
  const badgeStatus: BadgeStatus = useMemo(() => {
    if (contest.status === ContestStatus.DRAFT) {
      return 'draft'
    }
    if (contest.status === ContestStatus.REJECTED) {
      return 'rejected'
    }
    if (contest.status === ContestStatus.FINISHED) {
      return 'finished'
    }
    if (contest.status === ContestStatus.IN_REVIEW) {
      return 'inReview'
    }
    if (contest.status === ContestStatus.PENDING) {
      return 'pending'
    }
    if (DateTime.fromJSDate(contest.endDate) < DateTime.now()) {
      return 'judging'
    }
    if (
      DateTime.fromJSDate(contest.startDate) < DateTime.now() &&
      DateTime.fromJSDate(contest.endDate) > DateTime.now()
    ) {
      return 'live'
    }
    return 'approved'
  }, [contest])

  return (
    <Badge className={cn(backgroundColorMap[badgeStatus], className)}>
      {contestStatusTexts[badgeStatus]}
    </Badge>
  )
}

export default ContestStatusBadge
