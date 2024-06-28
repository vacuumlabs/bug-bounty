import {DateTime} from 'luxon'

import {ContestStatus, FindingSeverity} from '@/server/db/models'
import {ContestStatusText} from '@/lib/types/enums'

export const defaultSeverityWeights: Record<FindingSeverity, number> = {
  [FindingSeverity.CRITICAL]: 36,
  [FindingSeverity.HIGH]: 9,
  [FindingSeverity.MEDIUM]: 3,
  [FindingSeverity.LOW]: 1,
  [FindingSeverity.INFO]: 0,
}

export const getContestStatusText = ({
  startDate,
  endDate,
  status,
}: {
  startDate: Date
  endDate: Date
  status: ContestStatus
}): ContestStatusText => {
  if (status === ContestStatus.DRAFT) {
    return ContestStatusText.draft
  }
  if (status === ContestStatus.REJECTED) {
    return ContestStatusText.rejected
  }
  if (status === ContestStatus.FINISHED) {
    return ContestStatusText.finished
  }
  if (
    status !== ContestStatus.APPROVED &&
    DateTime.fromJSDate(startDate) < DateTime.now()
  ) {
    return ContestStatusText.notApproved
  }
  if (status === ContestStatus.IN_REVIEW) {
    return ContestStatusText.inReview
  }
  if (status === ContestStatus.PENDING) {
    return ContestStatusText.pending
  }
  if (DateTime.fromJSDate(endDate) < DateTime.now()) {
    return ContestStatusText.judging
  }
  if (
    DateTime.fromJSDate(startDate) < DateTime.now() &&
    DateTime.fromJSDate(endDate) > DateTime.now()
  ) {
    return ContestStatusText.live
  }
  return ContestStatusText.approved
}
