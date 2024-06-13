import {UseQueryOptions, useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {getContest} from '@/server/actions/contest/getContest'
import {Contest} from '@/server/db/schema/contest'

const getQueryOptions = (contestId: string | undefined) => ({
  queryKey: queryKeys.contests.one(contestId).queryKey,
  queryFn: withApiErrorHandler(() => {
    if (!contestId) {
      throw new Error('Contest ID is required.')
    }

    return getContest({contestId})
  }),
})

export const useGetContest = (
  contestId: string | undefined,
  options?: Partial<UseQueryOptions<Contest>>,
) => useQuery({...getQueryOptions(contestId), ...options})

export const prefetchGetContest = async (contestId: string) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(contestId))
}
