import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

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
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(confirmOrRejectContest),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contests._def,
      })
    },
  })
}

export const useEditContest = (
  options?: MutateOptions<Contest[], Error, EditContestRequest>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(editContest),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contests._def,
      })
    },
  })
}
