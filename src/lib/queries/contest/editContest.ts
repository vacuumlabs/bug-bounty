import {MutateOptions, useMutation} from '@tanstack/react-query'

import {
  ConfirmOrRejectContestParams,
  confirmOrRejectContest,
} from '@/server/actions/contest/editContest'
import {Contest} from '@/server/db/schema/contest'

export const useConfirmOrRejectContest = (
  options?: MutateOptions<Contest[], Error, ConfirmOrRejectContestParams>,
) => {
  return useMutation({
    ...options,
    mutationFn: confirmOrRejectContest,
    // TODO: invalidate relevant GET queries
  })
}
