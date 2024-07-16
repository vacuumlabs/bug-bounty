import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {getJudgeContestCounts} from '@/server/actions/contest/getJudgeContestCounts'

const queryOptions = {
  queryKey: queryKeys.judges.contestCounts.queryKey,
  queryFn: withApiErrorHandler(() => getJudgeContestCounts()),
}

export const useGetJudgeContestCounts = () => useQuery(queryOptions)

export const prefetchGetJudgeContestCounts = async () => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(queryOptions)
}
