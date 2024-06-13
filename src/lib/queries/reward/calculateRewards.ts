import {UseQueryOptions, useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  CalculateRewardsResponse,
  calculateRewards,
} from '@/server/actions/reward/calculateRewards'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useCalculatedRewards = (
  contestId: string,
  options?: Partial<UseQueryOptions<CalculateRewardsResponse>>,
) => {
  return useQuery({
    ...options,
    queryFn: withApiErrorHandler(() => calculateRewards(contestId)),
    queryKey: queryKeys.rewards.calculated(contestId).queryKey,
  })
}
