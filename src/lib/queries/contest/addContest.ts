import {MutateOptions, useMutation} from '@tanstack/react-query'

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
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(addContest),
    // TODO: invalidate relevant GET queries
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
