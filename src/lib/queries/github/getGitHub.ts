import {useQuery} from '@tanstack/react-query'
import {useSession} from 'next-auth/react'

import {queryKeys} from '../keys'

import {
  GetRepoBranchesParams,
  GetRepoFilesParams,
  getPublicRepos,
  getRepoBranches,
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
  const session = useSession()

  return useQuery({
    ...getPublicReposQueryOptions(userId),
    enabled: !!userId && session.data?.user.provider === 'github',
  })
}

const getRepoBranchesQueryOptions = (
  params: GetRepoBranchesParams | undefined,
) => ({
  queryKey: queryKeys.gitHub.repoBranches(params).queryKey,
  queryFn: withApiErrorHandler(() => {
    if (!params) {
      throw new Error('GetRepoBranchesParams is required.')
    }

    return getRepoBranches(params)
  }),
})

export const useGetRepoBranches = (
  params: GetRepoBranchesParams | undefined,
) => {
  const session = useSession()

  return useQuery({
    ...getRepoBranchesQueryOptions(params),
    enabled: !!params && session.data?.user.provider === 'github',
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

export const useGetRepoFiles = (params: GetRepoFilesParams | undefined) => {
  const session = useSession()

  return useQuery({
    ...getRepoFilesQueryOptions(params),
    enabled: !!params && session.data?.user.provider === 'github',
  })
}
