import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  DeleteFindingResponse,
  deleteFinding,
} from '@/server/actions/finding/deleteFinding'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useDeleteFinding = (
  options?: MutateOptions<DeleteFindingResponse, Error, string>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(deleteFinding),
    // TODO: invalidate relevant GET queries
  })
}
