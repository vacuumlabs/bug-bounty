import {MutateOptions, useMutation} from '@tanstack/react-query'

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
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(mergeDeduplicatedFindings),
    // TODO: invalidate relevant GET queries
  })
}
