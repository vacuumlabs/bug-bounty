import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  GetDeduplicatedFindingsParams,
  getDeduplicatedFindings,
  getDeduplicatedFindingsCount,
} from '@/server/actions/deduplicatedFinding/getDeduplicatedFinding'
import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'

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
