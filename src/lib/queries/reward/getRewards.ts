import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {
  getRewardsPayout,
  GetRewardsPayoutParams,
} from '@/server/actions/reward/getReward'
import {withApiErrorHandler} from '@/lib/utils/common/error'

const getQueryOptions = (params: GetRewardsPayoutParams) => ({
  queryKey: queryKeys.rewards.toPayout(params).queryKey,
  queryFn: withApiErrorHandler(() => getRewardsPayout(params)),
})

export const useGetRewardsPayout = (params: GetRewardsPayoutParams) =>
  useQuery(getQueryOptions(params))

export const prefetchGetRewardsPayout = async (
  params: GetRewardsPayoutParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
