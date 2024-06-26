import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  GetDeduplicatedFindingsParams,
  getDeduplicatedFinding,
  getDeduplicatedFindings,
  getDeduplicatedFindingsCount,
} from '@/server/actions/deduplicatedFinding/getDeduplicatedFinding'
import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'

const getDeduplicatedFindingQueryOptions = (deduplicatedFindingId: string) => ({
  queryKey: queryKeys.deduplicatedFindings.one(deduplicatedFindingId).queryKey,
  queryFn: withApiErrorHandler(() =>
    getDeduplicatedFinding(deduplicatedFindingId),
  ),
})

export const useGetDeduplicatedFinding = (deduplicatedFindingId: string) =>
  useQuery(getDeduplicatedFindingQueryOptions(deduplicatedFindingId))

export const prefetchGetDeduplicatedFinding = async (
  deduplicatedFindingId: string,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    getDeduplicatedFindingQueryOptions(deduplicatedFindingId),
  )
}

const getDeduplicatedFindingsQueryOptions = (
  params: GetDeduplicatedFindingsParams,
) => ({
  queryKey: queryKeys.deduplicatedFindings.all(params).queryKey,
  queryFn: withApiErrorHandler(() => getDeduplicatedFindings(params)),
})

export const useGetDeduplicatedFindings = (
  params: GetDeduplicatedFindingsParams,
) => useQuery(getDeduplicatedFindingsQueryOptions(params))

export const prefetchGetDeduplicatedFindings = async (
  params: GetDeduplicatedFindingsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getDeduplicatedFindingsQueryOptions(params))
}

const getGetDeduplicatedFindingsCountQueryOptions = (contestId: string) => ({
  queryKey: queryKeys.deduplicatedFindings.totalSize(contestId).queryKey,
  queryFn: withApiErrorHandler(() => getDeduplicatedFindingsCount(contestId)),
})

export const useGetDeduplicatedFindingsCount = (contestId: string) =>
  useQuery(getGetDeduplicatedFindingsCountQueryOptions(contestId))

export const prefetchGetDeduplicatedFindingsCount = async (
  contestId: string,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(
    getGetDeduplicatedFindingsCountQueryOptions(contestId),
  )
}
