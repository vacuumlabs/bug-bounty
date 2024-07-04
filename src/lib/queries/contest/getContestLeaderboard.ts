import {UseQueryOptions, useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  ContestLeaderboard,
  GetContestLeaderboardParams,
  getContestLeaderboard,
  getContestLeaderboardCount,
} from '@/server/actions/contest/getContestLeaderboard'
import {PaginatedResponse} from '@/lib/utils/common/pagination'

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
  await Promise.all([
    queryClient.prefetchQuery(getContestLeaderboardQueryOptions(params)),
    queryClient.prefetchQuery(
      getContestLeaderboardCountQueryOptions(params.contestId),
    ),
  ])
}

const getContestLeaderboardCountQueryOptions = (
  contestId: string | undefined,
) => ({
  queryKey: queryKeys.contests.leaderboardCount(contestId).queryKey,
  queryFn: withApiErrorHandler(() => {
    if (!contestId) {
      throw new Error('Contest ID is required.')
    }

    return getContestLeaderboardCount(contestId)
  }),
})

export const useGetContestLeaderboard = (
  params: GetContestLeaderboardParams,
  options?: Partial<UseQueryOptions<ContestLeaderboard>>,
): PaginatedResponse<ContestLeaderboard> => {
  const {data: countData} = useQuery(
    getContestLeaderboardCountQueryOptions(params.contestId),
  )

  return {
    data: useQuery({...getContestLeaderboardQueryOptions(params), ...options}),
    pageParams: {totalCount: countData?.count},
  }
}
