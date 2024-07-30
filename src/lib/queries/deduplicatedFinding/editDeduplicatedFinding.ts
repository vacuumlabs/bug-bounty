import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  MergeDeduplicatedFindingsRequest,
  MergeDeduplicatedFindingsResponse,
  mergeDeduplicatedFindings,
} from '@/server/actions/deduplicatedFinding/mergeDeduplicatedFindings'

export const useMergeDeduplicatedFindings = (
  options?: MutateOptions<
    MergeDeduplicatedFindingsResponse,
    Error,
    MergeDeduplicatedFindingsRequest
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(mergeDeduplicatedFindings),
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
