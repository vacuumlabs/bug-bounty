import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {getJudgeRewardCounts} from '@/server/actions/reward/getJudgeRewardCounts'

const queryOptions = {
  queryKey: queryKeys.rewards.judgeRewardCounts.queryKey,
  queryFn: withApiErrorHandler(() => getJudgeRewardCounts()),
}

export const useGetJudgeRewardCounts = () => useQuery(queryOptions)

export const prefetchGetJudgeRewardCounts = async () => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(queryOptions)
}
