import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {getPublicContestCounts} from '@/server/actions/contest/getPublicContestCounts'

const queryOptions = {
  queryKey: queryKeys.contests.publicCounts.queryKey,
  queryFn: withApiErrorHandler(() => getPublicContestCounts()),
}

export const useGetPublicContestCounts = () => useQuery(queryOptions)

export const prefetchGetPublicContestCounts = async () => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(queryOptions)
}
