import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  AddFindingProps,
  AddFindingResponse,
  addFinding,
} from '@/server/actions/addFinding'

export const useAddFinding = (
  options?: MutateOptions<AddFindingResponse, Error, AddFindingProps>,
) => {
  return useMutation({
    ...options,
    mutationFn: addFinding,
  })
}
