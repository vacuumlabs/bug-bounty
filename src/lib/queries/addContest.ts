import {MutateOptions, useMutation} from '@tanstack/react-query'

import {Contest, InsertContest, KnownIssue} from '@/server/db/schema/contest'
import {
  AddKnownIssuesProps,
  ConfirmOrRejectContestProps,
  addContest,
  addKnownIssues,
  confirmOrRejectContest,
} from '@/server/actions/addContest'

export const useAddContest = (
  options?: MutateOptions<
    Contest[],
    Error,
    Omit<InsertContest, 'authorId' | 'status'>
  >,
) => {
  return useMutation({
    ...options,
    mutationFn: addContest,
  })
}

export const useConfirmOrRejectContest = (
  options?: MutateOptions<Contest[], Error, ConfirmOrRejectContestProps>,
) => {
  return useMutation({
    ...options,
    mutationFn: confirmOrRejectContest,
  })
}

export const useAddKnownIssues = (
  options?: MutateOptions<KnownIssue[], Error, AddKnownIssuesProps>,
) => {
  return useMutation({
    ...options,
    mutationFn: addKnownIssues,
  })
}
