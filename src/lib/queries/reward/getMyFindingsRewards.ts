import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {useUserId} from '@/lib/hooks/useUserId'
import {
  GetMyFindingsRewardsParams,
  getMyFindingsRewards,
  getMyFindingsRewardsCount,
} from '@/server/actions/reward/getMyFindingsRewards'

const getMyFindingsRewardsQueryOptions = (
  userId: string | undefined,
  params: GetMyFindingsRewardsParams,
) => ({
  queryKey: queryKeys.rewards.mine(userId, params).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindingsRewards(params)),
})

export const useGetMyFindingsRewards = (params: GetMyFindingsRewardsParams) => {
  const userId = useUserId()

  return useQuery(getMyFindingsRewardsQueryOptions(userId, params))
}

export const prefetchGetMyFindingsRewards = async (
  userId: string,
  params: GetMyFindingsRewardsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    getMyFindingsRewardsQueryOptions(userId, params),
  )
}

const getMyFindingsRewardsCountQueryOptions = (userId: string | undefined) => ({
  queryKey: queryKeys.rewards.totalSize(userId).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindingsRewardsCount()),
})

export const useGetMyFindingsRewardsCount = () => {
  const userId = useUserId()

  return useQuery(getMyFindingsRewardsCountQueryOptions(userId))
}

export const prefetchGetMyFindingsRewardsCount = async (userId: string) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getMyFindingsRewardsCountQueryOptions(userId))
}
