import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  ConfirmOrRejectContestParams,
  confirmOrRejectContest,
} from '@/server/actions/contest/confirmOrRejectContest'
import {Contest} from '@/server/db/schema/contest'
import {EditContest, editContest} from '@/server/actions/contest/editContest'

export const useConfirmOrRejectContest = (
  options?: MutateOptions<Contest[], Error, ConfirmOrRejectContestParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: confirmOrRejectContest,
    // TODO: invalidate relevant GET queries
  })
}

export const useEditContest = (
  options?: MutateOptions<Contest[], Error, EditContest>,
) => {
  return useMutation({
    ...options,
    mutationFn: editContest,
    // TODO: invalidate relevant GET queries
  })
}
