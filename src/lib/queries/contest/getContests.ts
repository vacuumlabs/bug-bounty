import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {
  getPublicContests,
  type GetPublicContestsParams,
} from '@/server/actions/contest/getContests'
import {withApiErrorHandler} from '@/lib/utils/common/error'

const getQueryOptions = (params: GetPublicContestsParams) => ({
  queryKey: queryKeys.contests.public(params).queryKey,
  queryFn: withApiErrorHandler(() => getPublicContests(params)),
})

export const useGetPublicContests = (params: GetPublicContestsParams) =>
  useQuery(getQueryOptions(params))

export const prefetchGetPublicContests = async (
  params: GetPublicContestsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
