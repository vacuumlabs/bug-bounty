import {UseQueryOptions, useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  ContestLeaderboard,
  getContestLeaderboard,
} from '@/server/actions/contest/getContestLeaderboard'

const getQueryOptions = (contestId: string | undefined) => ({
  queryKey: queryKeys.contests.leaderboard(contestId).queryKey,
  queryFn: withApiErrorHandler(() => {
    if (!contestId) {
      throw new Error('Contest ID is required.')
    }

    return getContestLeaderboard({contestId})
  }),
})

export const useGetContestLeaderboard = (
  contestId: string | undefined,
  options?: Partial<UseQueryOptions<ContestLeaderboard>>,
) => useQuery({...getQueryOptions(contestId), ...options})

export const prefetchGetContestLeaderboard = async (contestId: string) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(contestId))
}
