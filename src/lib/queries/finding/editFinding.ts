import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  EditFindingParams,
  editFinding,
} from '@/server/actions/finding/editFinding'
import {Finding} from '@/server/db/schema/finding'

export const useEditFinding = (
  options?: MutateOptions<Finding[], Error, EditFindingParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: editFinding,
    // TODO: invalidate relevant GET queries
  })
}
