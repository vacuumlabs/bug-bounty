import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  EditFindingRequest,
  editFinding,
} from '@/server/actions/finding/editFinding'
import {Finding} from '@/server/db/schema/finding'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  ApproveOrRejectFindingRequest,
  approveOrRejectFinding,
} from '@/server/actions/finding/approveOrRejectFinding'

export const useEditFinding = (
  options?: MutateOptions<Finding[], Error, EditFindingRequest>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(editFinding),
    // TODO: invalidate relevant GET queries
  })
}

export const useApproveOrRejectFinding = (
  options?: MutateOptions<Finding[], Error, ApproveOrRejectFindingRequest>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(approveOrRejectFinding),
    // TODO: invalidate relevant GET queries
  })
}
