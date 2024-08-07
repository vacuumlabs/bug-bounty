import {UseQueryOptions, useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  ContestLeaderboard,
  GetContestLeaderboardParams,
  getContestLeaderboard,
} from '@/server/actions/contest/getContestLeaderboard'

const getContestLeaderboardQueryOptions = (
  params: GetContestLeaderboardParams,
) => ({
  queryKey: queryKeys.contests.leaderboard(params).queryKey,
  queryFn: withApiErrorHandler(() => {
    if (!params.contestId) {
      throw new Error('Contest ID is required.')
    }

    return getContestLeaderboard(params)
  }),
})

export const prefetchGetContestLeaderboard = async (
  params: GetContestLeaderboardParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getContestLeaderboardQueryOptions(params))
}

export const useGetContestLeaderboard = (
  params: GetContestLeaderboardParams,
  options?: Partial<UseQueryOptions<ContestLeaderboard>>,
) => useQuery({...getContestLeaderboardQueryOptions(params), ...options})
