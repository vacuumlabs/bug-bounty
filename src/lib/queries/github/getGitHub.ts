import {useQuery} from '@tanstack/react-query'

import {queryKeys} from '../keys'

import {
  GetRepoFilesParams,
  getPublicRepos,
  getRepoFiles,
} from '@/server/actions/github/getGithub'
import {useUserId} from '@/lib/hooks/useUserId'

const getPublicReposQueryOptions = (userId: string | undefined) => ({
  queryKey: queryKeys.gitHub.publicRepos(userId).queryKey,
  queryFn: () => getPublicRepos(),
})

export const useGetPublicRepos = () => {
  const userId = useUserId()

  return useQuery({...getPublicReposQueryOptions(userId), enabled: !!userId})
}

const getRepoFilesQueryOptions = (params: GetRepoFilesParams | undefined) => ({
  queryKey: queryKeys.gitHub.repoFiles(params).queryKey,
  queryFn: () => (params ? getRepoFiles(params) : null),
})

export const useGetRepoFiles = (params: GetRepoFilesParams | undefined) =>
  useQuery({...getRepoFilesQueryOptions(params), enabled: !!params})
