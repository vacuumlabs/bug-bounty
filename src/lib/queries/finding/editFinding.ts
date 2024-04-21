import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  EditFindingParams,
  editFinding,
} from '@/server/actions/finding/editFinding'
import {Finding} from '@/server/db/schema/finding'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useEditFinding = (
  options?: MutateOptions<Finding[], Error, EditFindingParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(editFinding),
    // TODO: invalidate relevant GET queries
  })
}
