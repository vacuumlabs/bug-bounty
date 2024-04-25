import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  GetDeduplicatedFindingsParams,
  getDeduplicatedFindings,
} from '@/server/actions/deduplicatedFinding/getDeduplicatedFinding'
import getServerQueryClient from '@/server/utils/queryClient'

const getQueryOptions = (params: GetDeduplicatedFindingsParams) => ({
  queryKey: queryKeys.deduplicatedFindings.all(params).queryKey,
  queryFn: () => getDeduplicatedFindings(params),
})

export const useGetDeduplicatedFindings = (
  params: GetDeduplicatedFindingsParams,
) => useQuery(getQueryOptions(params))

export const prefetchGetDeduplicatedFindings = async (
  params: GetDeduplicatedFindingsParams,
) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(params))
}
