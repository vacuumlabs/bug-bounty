import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  AddFindingParams,
  AddFindingResponse,
  addFinding,
} from '@/server/actions/finding/addFinding'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useAddFinding = (
  options?: MutateOptions<AddFindingResponse, Error, AddFindingParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(addFinding),
    // TODO: invalidate relevant GET queries
  })
}
