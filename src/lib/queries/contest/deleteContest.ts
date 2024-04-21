import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  DeleteContestResponse,
  deleteContest,
} from '@/server/actions/contest/deleteContest'
import {
  DeleteKnownIssueResponse,
  deleteKnownIssue,
} from '@/server/actions/contest/deleteKnownIssue'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useDeleteContest = (
  options?: MutateOptions<DeleteContestResponse, Error, string>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(deleteContest),
    // TODO: invalidate relevant GET queries
  })
}

export const useDeleteKnownIssue = (
  options?: MutateOptions<DeleteKnownIssueResponse, Error, string>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(deleteKnownIssue),
    // TODO: invalidate relevant GET queries
  })
}
