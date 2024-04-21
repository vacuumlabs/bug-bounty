import {MutateOptions, useMutation} from '@tanstack/react-query'

import {deleteContest} from '@/server/actions/contest/deleteContest'
import {deleteKnownIssue} from '@/server/actions/contest/deleteKnownIssue'

export const useDeleteContest = (
  options?: MutateOptions<void, Error, string>,
) => {
  return useMutation({
    ...options,
    mutationFn: deleteContest,
    // TODO: invalidate relevant GET queries
  })
}

export const useDeleteKnownIssue = (
  options?: MutateOptions<void, Error, string>,
) => {
  return useMutation({
    ...options,
    mutationFn: deleteKnownIssue,
    // TODO: invalidate relevant GET queries
  })
}
