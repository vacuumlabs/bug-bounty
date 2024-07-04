import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {useUserId} from '@/lib/hooks/useUserId'
import {
  GetMyFindingsRewardsParams,
  MyFindingsReward,
  getMyFindingsRewards,
  getMyFindingsRewardsCount,
} from '@/server/actions/reward/getMyFindingsRewards'
import {PaginatedResponse} from '@/lib/utils/common/pagination'

const getMyFindingsRewardsQueryOptions = (
  userId: string | undefined,
  params: GetMyFindingsRewardsParams,
) => ({
  queryKey: queryKeys.rewards.mine(userId, params).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindingsRewards(params)),
})

export const prefetchGetMyFindingsRewards = async (
  userId: string,
  params: GetMyFindingsRewardsParams,
) => {
  const queryClient = getServerQueryClient()
  await Promise.all([
    queryClient.prefetchQuery(getMyFindingsRewardsQueryOptions(userId, params)),
    queryClient.prefetchQuery(getMyFindingsRewardsCountQueryOptions(userId)),
  ])
}

const getMyFindingsRewardsCountQueryOptions = (userId: string | undefined) => ({
  queryKey: queryKeys.rewards.totalSize(userId).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindingsRewardsCount()),
})

export const useGetMyFindingsRewards = (
  params: GetMyFindingsRewardsParams,
): PaginatedResponse<MyFindingsReward[]> => {
  const userId = useUserId()

  const {data: countData} = useQuery(
    getMyFindingsRewardsCountQueryOptions(userId),
  )

  return {
    data: useQuery(getMyFindingsRewardsQueryOptions(userId, params)),
    pageParams: {totalCount: countData?.count},
  }
}
