import {MutateOptions, useMutation} from '@tanstack/react-query'

import {Contest} from '@/server/db/schema/contest'
import {AddContest, addContest} from '@/server/actions/contest/addContest'
import {KnownIssue} from '@/server/db/schema/knownIssue'
import {
  AddKnownIssuesParams,
  addKnownIssues,
} from '@/server/actions/contest/addKnownIssues'

export const useAddContest = (
  options?: MutateOptions<Contest[], Error, AddContest>,
) => {
  return useMutation({
    ...options,
    mutationFn: addContest,
    // TODO: invalidate relevant GET queries
  })
}

export const useAddKnownIssues = (
  options?: MutateOptions<KnownIssue[], Error, AddKnownIssuesParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: addKnownIssues,
    // TODO: invalidate relevant GET queries
  })
}
