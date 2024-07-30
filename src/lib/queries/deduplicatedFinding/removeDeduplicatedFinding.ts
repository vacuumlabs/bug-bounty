import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  removeDeduplicatedFinding,
  RemoveDeduplicatedFindingRequest,
  RemoveDeduplicatedFindingResponse,
} from '@/server/actions/deduplicatedFinding/removeDeduplicatedFinding'

export const useRemoveDededuplicatedFinding = (
  options?: MutateOptions<
    RemoveDeduplicatedFindingResponse,
    Error,
    RemoveDeduplicatedFindingRequest
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(removeDeduplicatedFinding),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.deduplicatedFindings._def,
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.findings._def,
      })
    },
  })
}
