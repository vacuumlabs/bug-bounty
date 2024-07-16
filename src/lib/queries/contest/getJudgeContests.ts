import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {
  GetJudgeContestsParams,
  getJudgeContests,
} from '@/server/actions/contest/getJudgeContests'

const getQueryOptions = (params: GetJudgeContestsParams) => ({
  queryKey: queryKeys.judges.contests(params).queryKey,
  queryFn: withApiErrorHandler(() => getJudgeContests(params)),
})

export const useGetJudgeContests = (params: GetJudgeContestsParams) =>
  useQuery(getQueryOptions(params))

export const prefetchGetJudgeContests = async (
  params: GetJudgeContestsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
