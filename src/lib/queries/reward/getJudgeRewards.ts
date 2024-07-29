import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  getJudgeRewards,
  GetJudgeRewardsParams,
} from '@/server/actions/reward/getJudgeRewards'

const getQueryOptions = (params: GetJudgeRewardsParams) => ({
  queryKey: queryKeys.rewards.judgeRewards(params).queryKey,
  queryFn: withApiErrorHandler(() => getJudgeRewards(params)),
})

export const useGetJudgeRewards = (params: GetJudgeRewardsParams) =>
  useQuery(getQueryOptions(params))

export const prefetchGetJudgeRewards = async (
  params: GetJudgeRewardsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
