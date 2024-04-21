import {requireServerSession} from '../auth'

import {db} from '@/server/db'
import {ContestStatus} from '@/server/db/schema/contest'

export const requireEditableContest = async (contestId: string) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {
      authorId: true,
      endDate: true,
      startDate: true,
      status: true,
    },
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new Error('Contest not found.')
  }

  if (contest.authorId !== session.user.id) {
    throw new Error('Only authors or admins can update the contests.')
  }

  if (
    contest.status !== ContestStatus.PENDING &&
    contest.status !== ContestStatus.DRAFT
  ) {
    throw new Error('Only pending or draft contests can be edited.')
  }

  return contest
}
