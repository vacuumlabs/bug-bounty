import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {getMyContestsReportCounts} from '@/server/actions/contest/getMyContestsReportCounts'

const queryOptions = {
  queryKey: queryKeys.contests.reportCounts.queryKey,
  queryFn: withApiErrorHandler(() => getMyContestsReportCounts()),
}

export const useGetMyContestsReportCounts = () => useQuery(queryOptions)

export const prefetchGetMyContestsReportCounts = async () => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(queryOptions)
}
