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
import {useUserId} from '@/lib/hooks/useUserId'

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

const getGetMyFindingsQueryOptions = (
  userId: string | undefined,
  params: GetMyFindingsParams,
) => ({
  queryKey: queryKeys.findings.mine(userId, params).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindings(params)),
})

export const useGetMyFindings = (params: GetMyFindingsParams) => {
  const userId = useUserId()

  return useQuery({
    ...getGetMyFindingsQueryOptions(userId, params),
    enabled: !!userId,
  })
}

export const prefetchGetMyFindings = async (
  userId: string,
  params: GetMyFindingsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getGetMyFindingsQueryOptions(userId, params))
}
