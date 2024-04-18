import {MutateOptions, useMutation} from '@tanstack/react-query'

import {Contest, KnownIssue} from '@/server/db/schema/contest'
import {
  AddContestParam,
  AddKnownIssuesProps,
  ConfirmOrRejectContestProps,
  addContest,
  addKnownIssues,
  confirmOrRejectContest,
} from '@/server/actions/addContest'

export const useAddContest = (
  options?: MutateOptions<Contest[], Error, AddContestParam>,
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
