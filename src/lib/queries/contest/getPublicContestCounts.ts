import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetPublicContestCountsParams,
  getPublicContestCounts,
} from '@/server/actions/contest/getPublicContestCounts'

const getQueryOptions = (params: GetPublicContestCountsParams) => ({
  queryKey: queryKeys.contests.publicCounts(params).queryKey,
  queryFn: withApiErrorHandler(() => getPublicContestCounts(params)),
})

export const useGetPublicContestCounts = (
  params: GetPublicContestCountsParams,
) => useQuery(getQueryOptions(params))

export const prefetchGetPublicContestCounts = async (
  params: GetPublicContestCountsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
