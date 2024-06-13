'use server'

import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'

export type GetContestParams = {
  contestId: string
}

const getContestAction = async ({contestId}: GetContestParams) => {
  const contest = await db.query.contests.findFirst({
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new ServerError('Contest not found.')
  }

  return contest
}

export const getContest = serializeServerErrors(getContestAction)
