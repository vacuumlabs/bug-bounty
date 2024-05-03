import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  GetRepoFilesParams,
  getPublicRepos,
  getRepoFiles,
} from '@/server/actions/github/getGithub'
import {useUserId} from '@/lib/hooks/useUserId'
import {withApiErrorHandler} from '@/lib/utils/common/error'

const getPublicReposQueryOptions = (userId: string | undefined) => ({
  queryKey: queryKeys.gitHub.publicRepos(userId).queryKey,
  queryFn: withApiErrorHandler(() => getPublicRepos()),
})

export const useGetPublicRepos = () => {
  const userId = useUserId()

  return useQuery({...getPublicReposQueryOptions(userId), enabled: !!userId})
}

const getRepoFilesQueryOptions = (params: GetRepoFilesParams) => ({
  queryKey: queryKeys.gitHub.repoFiles(params).queryKey,
  queryFn: withApiErrorHandler(() => getRepoFiles(params)),
})

export const useGetRepoFiles = (
  params: GetRepoFilesParams,
  options?: {enabled?: boolean},
) => useQuery({...options, ...getRepoFilesQueryOptions(params)})
