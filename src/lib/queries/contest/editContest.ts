import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  ReviewContestRequest,
  reviewContest,
} from '@/server/actions/contest/reviewContest'
import {Contest} from '@/server/db/schema/contest'
import {
  EditContestRequest,
  editContest,
} from '@/server/actions/contest/editContest'
import {withApiErrorHandler} from '@/lib/utils/common/error'

export const useReviewContest = (
  options?: MutateOptions<Contest[], Error, ReviewContestRequest>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(reviewContest),
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
