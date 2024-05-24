import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetMyContestsParams,
  getMyContests,
} from '@/server/actions/contest/getMyContests'

const getQueryOptions = (params: GetMyContestsParams) => ({
  queryKey: queryKeys.contests.mine(params).queryKey,
  queryFn: withApiErrorHandler(() => getMyContests(params)),
})

export const useGetMyContests = (params: GetMyContestsParams) =>
  useQuery(getQueryOptions(params))

export const prefetchGetMyContests = async (params: GetMyContestsParams) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
