import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {Contest} from '@/server/db/schema/contest'
import {
  AddContestRequest,
  addContest,
} from '@/server/actions/contest/addContest'
import {KnownIssue} from '@/server/db/schema/knownIssue'
import {
  AddKnownIssuesRequest,
  addKnownIssues,
} from '@/server/actions/contest/addKnownIssues'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useAddContest = (
  options?: MutateOptions<Contest[], Error, AddContestRequest>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(addContest),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contests._def,
      })
    },
  })
}

export const useAddKnownIssues = (
  options?: MutateOptions<KnownIssue[], Error, AddKnownIssuesRequest>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(addKnownIssues),
    // TODO: invalidate relevant GET queries
  })
}
