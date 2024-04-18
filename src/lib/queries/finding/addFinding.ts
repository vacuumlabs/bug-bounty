import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  AddFindingParams,
  AddFindingResponse,
  addFinding,
} from '@/server/actions/finding/addFinding'

export const useAddFinding = (
  options?: MutateOptions<AddFindingResponse, Error, AddFindingParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: addFinding,
    // TODO: invalidate relevant GET queries
  })
}
