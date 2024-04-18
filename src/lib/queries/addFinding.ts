import {MutateOptions, useMutation} from '@tanstack/react-query'

import {AddFindingProps, addFinding} from '@/server/actions/addFinding'
import {Finding} from '@/server/db/schema/finding'

export const useAddFinding = (
  options?: MutateOptions<Finding, Error, AddFindingProps>,
) => {
  return useMutation({
    ...options,
    mutationFn: addFinding,
  })
}
