import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  AddFindingRequest,
  AddFindingResponse,
  addFinding,
} from '@/server/actions/finding/addFinding'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useAddFinding = (
  options?: MutateOptions<AddFindingResponse, Error, AddFindingRequest>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(addFinding),
    // TODO: invalidate relevant GET queries
  })
}
