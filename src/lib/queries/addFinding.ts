import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  AddFindingProps,
  AddFindingReturn,
  addFinding,
} from '@/server/actions/addFinding'

export const useAddFinding = (
  options?: MutateOptions<AddFindingReturn, Error, AddFindingProps>,
) => {
  return useMutation({
    ...options,
    mutationFn: addFinding,
  })
}
