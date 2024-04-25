import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

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
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(deleteContest),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contests._def,
      })
    },
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
