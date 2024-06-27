import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetMyFindingParams,
  GetMyFindingsParams,
  getMyFinding,
  getMyFindings,
} from '@/server/actions/finding/getMyFinding'

const getGetMyFindingQueryOptions = (params: GetMyFindingParams) => ({
  queryKey: queryKeys.findings.mineOne(params).queryKey,
  queryFn: withApiErrorHandler(() => getMyFinding(params)),
})

export const useGetMyFinding = (params: GetMyFindingParams) =>
  useQuery(getGetMyFindingQueryOptions(params))

export const prefetchGetMyFinding = async (params: GetMyFindingParams) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getGetMyFindingQueryOptions(params))
}

const getGetMyFindingsQueryOptions = (params: GetMyFindingsParams) => ({
  queryKey: queryKeys.findings.mine(params).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindings(params)),
})

export const useGetMyFindings = (params: GetMyFindingsParams) =>
  useQuery(getGetMyFindingsQueryOptions(params))

export const prefetchGetMyFindings = async (params: GetMyFindingsParams) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getGetMyFindingsQueryOptions(params))
}
