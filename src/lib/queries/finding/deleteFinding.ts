import {MutateOptions, useMutation} from '@tanstack/react-query'

import {deleteFinding} from '@/server/actions/finding/deleteFinding'

export const useDeleteFinding = (
  options?: MutateOptions<void, Error, string>,
) => {
  return useMutation({
    ...options,
    mutationFn: deleteFinding,
    // TODO: invalidate relevant GET queries
  })
}
