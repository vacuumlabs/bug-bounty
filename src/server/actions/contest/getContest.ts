'use server'

import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'

export type GetContestParams = {
  contestId: string
}

export type Contest = Awaited<ReturnType<typeof getContestAction>>

const getContestAction = async ({contestId}: GetContestParams) => {
  const contest = await db.query.contests.findFirst({
    where: (contests, {eq}) => eq(contests.id, contestId),
    with: {
      contestSeverityWeights: {
        columns: {
          info: true,
          low: true,
          medium: true,
          high: true,
          critical: true,
        },
      },
    },
  })

  if (!contest) {
    throw new ServerError('Contest not found.')
  }

  return contest
}

export const getContest = serializeServerErrors(getContestAction)
