import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetFindingParams,
  GetFindingsParams,
  getFinding,
  getFindings,
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
