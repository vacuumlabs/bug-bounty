import {QueryOptions, useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  CalculateRewardsResponse,
  calculateRewards,
} from '@/server/actions/reward/calculateRewards'

export const useCalculatedRewards = (
  contestId: string,
  options?: QueryOptions<CalculateRewardsResponse>,
) => {
  return useQuery({
    ...options,
    queryFn: () => calculateRewards(contestId),
    queryKey: queryKeys.rewards.calculated(contestId).queryKey,
  })
}
