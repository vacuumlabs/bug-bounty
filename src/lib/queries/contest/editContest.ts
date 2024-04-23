import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  ConfirmOrRejectContestRequest,
  confirmOrRejectContest,
} from '@/server/actions/contest/confirmOrRejectContest'
import {Contest} from '@/server/db/schema/contest'
import {
  EditContestRequest,
  editContest,
} from '@/server/actions/contest/editContest'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useConfirmOrRejectContest = (
  options?: MutateOptions<Contest[], Error, ConfirmOrRejectContestRequest>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(confirmOrRejectContest),
    // TODO: invalidate relevant GET queries
  })
}

export const useEditContest = (
  options?: MutateOptions<Contest[], Error, EditContestRequest>,
) => {
  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(editContest),
    // TODO: invalidate relevant GET queries
  })
}
