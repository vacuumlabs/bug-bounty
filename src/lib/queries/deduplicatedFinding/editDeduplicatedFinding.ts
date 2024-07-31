import {MutateOptions, useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  MergeDeduplicatedFindingsRequest,
  MergeDeduplicatedFindingsResponse,
  mergeDeduplicatedFindings,
} from '@/server/actions/deduplicatedFinding/mergeDeduplicatedFindings'
import {
  editDeduplicatedFinding,
  EditDeduplicatedFindingRequest,
  EditDeduplicatedFindingResponse,
  setBestFinding,
  SetBestFindingRequest,
  SetBestFindingResponse,
} from '@/server/actions/deduplicatedFinding/editDeduplicatedFinding'

export const useMergeDeduplicatedFindings = (
  options?: MutateOptions<
    MergeDeduplicatedFindingsResponse,
    Error,
    MergeDeduplicatedFindingsRequest
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(mergeDeduplicatedFindings),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.deduplicatedFindings._def,
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.findings._def,
      })
    },
  })
}

export const useEditDeduplicatedFinding = (
  options?: MutateOptions<
    EditDeduplicatedFindingResponse,
    Error,
    EditDeduplicatedFindingRequest
  >,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(editDeduplicatedFinding),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.deduplicatedFindings._def,
      })
    },
  })
}

export const useSetBestFinding = (
  options?: MutateOptions<SetBestFindingResponse, Error, SetBestFindingRequest>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: withApiErrorHandler(setBestFinding),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.deduplicatedFindings._def,
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.findings._def,
      })
    },
  })
}
