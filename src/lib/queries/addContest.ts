import {MutateOptions, useMutation} from '@tanstack/react-query'

import {Contest, InsertContest} from '@/server/db/schema/contest'
import {
  ConfirmOrRejectContestProps,
  addContest,
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
    mutationFn: (values: ConfirmOrRejectContestProps) =>
      confirmOrRejectContest(values),
  })
}
