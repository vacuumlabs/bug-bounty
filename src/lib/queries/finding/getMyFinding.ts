import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetMyFindingsParams,
  getMyFindings,
} from '@/server/actions/finding/getMyFindings'

const getQueryOptions = (params: GetMyFindingsParams) => ({
  queryKey: queryKeys.findings.mine(params).queryKey,
  queryFn: withApiErrorHandler(() => getMyFindings(params)),
})

export const useGetMyFindings = (params: GetMyFindingsParams) =>
  useQuery(getQueryOptions(params))

export const prefetchGetMyFindings = async (params: GetMyFindingsParams) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
