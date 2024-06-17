import {DateTime} from 'luxon'

import {ContestStatus, FindingSeverity} from '@/server/db/models'

export const defaultSeverityWeights: Record<FindingSeverity, number> = {
  [FindingSeverity.CRITICAL]: 36,
  [FindingSeverity.HIGH]: 9,
  [FindingSeverity.MEDIUM]: 3,
  [FindingSeverity.LOW]: 1,
  [FindingSeverity.INFO]: 0,
}

export const getContestStatus = ({
  startDate,
  endDate,
  status,
}: {
  startDate: Date
  endDate: Date
  status: ContestStatus
}) => {
  if (status === ContestStatus.DRAFT) {
    return 'draft'
  }
  if (status === ContestStatus.REJECTED) {
    return 'rejected'
  }
  if (status === ContestStatus.FINISHED) {
    return 'finished'
  }
  if (
    status !== ContestStatus.APPROVED &&
    DateTime.fromJSDate(startDate) < DateTime.now()
  ) {
    return 'notApproved'
  }
  if (status === ContestStatus.IN_REVIEW) {
    return 'inReview'
  }
  if (status === ContestStatus.PENDING) {
    return 'pending'
  }
  if (DateTime.fromJSDate(endDate) < DateTime.now()) {
    return 'judging'
  }
  if (
    DateTime.fromJSDate(startDate) < DateTime.now() &&
    DateTime.fromJSDate(endDate) > DateTime.now()
  ) {
    return 'live'
  }
  return 'approved'
}
