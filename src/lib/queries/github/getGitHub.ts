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

export const useGetPublicRepos = (provider: string | undefined) => {
  const userId = useUserId()

  return useQuery({
    ...getPublicReposQueryOptions(userId),
    enabled: !!userId && provider === 'github',
  })
}

const getRepoFilesQueryOptions = (params: GetRepoFilesParams | undefined) => ({
  queryKey: queryKeys.gitHub.repoFiles(params).queryKey,
  queryFn: withApiErrorHandler(() => {
    if (!params) {
      throw new Error('GetRepoFilesParams is required.')
    }

    return getRepoFiles(params)
  }),
})

export const useGetRepoFiles = (
  params: GetRepoFilesParams | undefined,
  provider: string | undefined,
) =>
  useQuery({
    ...getRepoFilesQueryOptions(params),
    enabled: !!params && provider === 'github',
  })
