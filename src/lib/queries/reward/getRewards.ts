import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {
  getRewards,
  type GetRewardsParams,
} from '@/server/actions/reward/getReward'
import {withApiErrorHandler} from '@/lib/utils/common/error'

const getQueryOptions = (params: GetRewardsParams) => ({
  queryKey: queryKeys.rewards.all(params).queryKey,
  queryFn: withApiErrorHandler(() => getRewards(params)),
})

export const useGetRewards = (params: GetRewardsParams) =>
  useQuery(getQueryOptions(params))

export const prefetchGetRewards = async (params: GetRewardsParams) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
