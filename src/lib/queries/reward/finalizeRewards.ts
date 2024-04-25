import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  FinalizeRewardsResponse,
  finalizeRewards,
} from '@/server/actions/reward/finalizeRewards'

export const useFinalizeRewards = (
  options?: MutateOptions<FinalizeRewardsResponse, Error, string>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withApiErrorHandler(finalizeRewards),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.rewards.all._def,
      })
      // TODO: invalidate get contest
    },
    ...options,
  })
}
