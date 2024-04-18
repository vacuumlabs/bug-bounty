import {MutateOptions, useMutation} from '@tanstack/react-query'

import {Contest, KnownIssue} from '@/server/db/schema/contest'
import {
  AddContest,
  AddKnownIssuesParams,
  ConfirmOrRejectContestParams,
  addContest,
  addKnownIssues,
  confirmOrRejectContest,
} from '@/server/actions/addContest'

export const useAddContest = (
  options?: MutateOptions<Contest[], Error, AddContest>,
) => {
  return useMutation({
    ...options,
    mutationFn: addContest,
  })
}

export const useConfirmOrRejectContest = (
  options?: MutateOptions<Contest[], Error, ConfirmOrRejectContestParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: confirmOrRejectContest,
  })
}

export const useAddKnownIssues = (
  options?: MutateOptions<KnownIssue[], Error, AddKnownIssuesParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: addKnownIssues,
  })
}
