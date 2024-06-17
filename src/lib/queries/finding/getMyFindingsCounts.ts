import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import getServerQueryClient from '@/server/utils/queryClient'
import {withApiErrorHandler} from '@/lib/utils/common/error'
import {getMyFindingsCounts} from '@/server/actions/finding/getMyFindingsCounts'

const queryOptions = {
  queryKey: queryKeys.findings.counts.queryKey,
  queryFn: withApiErrorHandler(() => getMyFindingsCounts()),
}

export const useGetMyFindingsCounts = () => useQuery(queryOptions)

export const prefetchGetMyFindingsCounts = async () => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(queryOptions)
}
