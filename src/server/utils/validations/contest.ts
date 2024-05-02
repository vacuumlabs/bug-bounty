import {requireServerSession} from '../auth'

import {ServerError} from '@/lib/types/error'
import {db} from '@/server/db'
import {ContestStatus} from '@/server/db/models'

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
    throw new ServerError('Contest not found.')
  }

  if (contest.authorId !== session.user.id) {
    throw new ServerError('Only authors or admins can update the contests.')
  }

  if (
    contest.status !== ContestStatus.PENDING &&
    contest.status !== ContestStatus.DRAFT
  ) {
    throw new ServerError('Only pending or draft contests can be edited.')
  }

  return contest
}
