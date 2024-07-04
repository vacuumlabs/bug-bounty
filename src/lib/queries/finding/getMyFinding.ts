import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetMyFindingParams,
  GetMyFindingsParams,
  MyFinding,
  getMyFinding,
  getMyFindings,
  getMyFindingsCount,
} from '@/server/actions/finding/getMyFinding'
import {FindingOccurence} from '@/server/db/models'
import {useUserId} from '@/lib/hooks/useUserId'
import {PaginatedResponse} from '@/lib/utils/common/pagination'

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

const getGetMyFindingsCountQueryOptions = (
  userId?: string,
  type?: FindingOccurence,
) => ({
  queryKey: queryKeys.findings.mineTotalSize(userId, type).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindingsCount(type)),
})

export const useGetMyFindings = (
  params: GetMyFindingsParams,
): PaginatedResponse<MyFinding[]> => {
  const userId = useUserId()

  const {data: countData} = useQuery({
    ...getGetMyFindingsCountQueryOptions(userId, params.type),
    enabled: !!userId,
  })

  return {
    data: useQuery({
      ...getGetMyFindingsQueryOptions(userId, params),
      enabled: !!userId,
    }),
    pageParams: {totalCount: countData?.count},
  }
}

export const prefetchGetMyFindings = async (
  userId: string,
  params: GetMyFindingsParams,
) => {
  const queryClient = getServerQueryClient()
  await Promise.all([
    queryClient.prefetchQuery(getGetMyFindingsQueryOptions(userId, params)),
    queryClient.prefetchQuery(
      getGetMyFindingsCountQueryOptions(userId, params.type),
    ),
  ])
}
