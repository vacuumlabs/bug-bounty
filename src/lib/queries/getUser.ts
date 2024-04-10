import {useQuery} from '@tanstack/react-query'

import {queryKeys} from './keys'
import {useUserId} from '../hooks/useUserId'

import {getUser} from '@/server/actions/getUser'
import getServerQueryClient from '@/server/utils/queryClient'

const getQueryOptions = (userId: string | undefined) => ({
  queryKey: queryKeys.users.detail(userId).queryKey,
  queryFn: () => getUser(),
})

export const useGetUser = () => {
  const userId = useUserId()

  return useQuery({
    ...getQueryOptions(userId),
    enabled: !!userId,
  })
}

export const prefetchGetUser = async (userId: string) => {
  const queryClient = getServerQueryClient()
  await queryClient.prefetchQuery(getQueryOptions(userId))
}
