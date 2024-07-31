import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetContestFindingsParams,
  GetFindingParams,
  GetFindingsParams,
  GetFindingsToDeduplicateRequest,
  getContestFindings,
  getFinding,
  getFindings,
  getFindingsToDeduplicate,
} from '@/server/actions/finding/getFinding'

const getFindingQueryOptions = (params: GetFindingParams) => ({
  queryKey: queryKeys.findings.one(params).queryKey,
  queryFn: withApiErrorHandler(() => getFinding(params)),
})

export const useGetFinding = (params: GetFindingParams) =>
  useQuery(getFindingQueryOptions(params))

export const prefetchGetFinding = async (params: GetFindingParams) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getFindingQueryOptions(params))
}

const getFindingsQueryOptions = (params: GetFindingsParams) => ({
  queryKey: queryKeys.findings.byDeduplicatedFinding(params).queryKey,
  queryFn: withApiErrorHandler(() => getFindings(params)),
})

export const useGetFindings = (params: GetFindingsParams) =>
  useQuery(getFindingsQueryOptions(params))

export const prefetchGetFindings = async (params: GetFindingsParams) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getFindingsQueryOptions(params))
}

const getContestFindingsQueryOptions = (params: GetContestFindingsParams) => ({
  queryKey: queryKeys.findings.byContest(params).queryKey,
  queryFn: withApiErrorHandler(() => getContestFindings(params)),
})

export const useGetContestFindings = (params: GetContestFindingsParams) =>
  useQuery(getContestFindingsQueryOptions(params))

export const prefetchGetContestFindings = async (
  params: GetContestFindingsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getContestFindingsQueryOptions(params))
}

const getFindingsToDeduplicateQueryOptions = (
  params: GetFindingsToDeduplicateRequest,
) => ({
  queryKey: queryKeys.findings.toDeduplicate(params).queryKey,
  queryFn: withApiErrorHandler(() => getFindingsToDeduplicate(params)),
})

export const useGetFindingsToDeduplicate = (
  params: GetFindingsToDeduplicateRequest,
) => useQuery(getFindingsToDeduplicateQueryOptions(params))

export const prefetchGetFindingsToDeduplicate = async (
  params: GetFindingsToDeduplicateRequest,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getFindingsToDeduplicateQueryOptions(params))
}
