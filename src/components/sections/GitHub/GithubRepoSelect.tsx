'use client'

import {ArrowLeft} from 'lucide-react'
import {signIn, useSession} from 'next-auth/react'

import {Button} from '@/components/ui/Button'
import {useGetPublicRepos} from '@/lib/queries/github/getGitHub'
import {GithubRepository} from '@/server/actions/github/getGithub'
import {ScrollArea} from '@/components/ui/ScrollArea'

type GithubRepoSelect = {
  selectedRepo: GithubRepository | null
  onSelectRepo: (repo: GithubRepository | null) => void
}

const GithubRepoSelect = ({selectedRepo, onSelectRepo}: GithubRepoSelect) => {
  const session = useSession()

  const {data: publicReposData, isLoading: publicReposIsLoading} =
    useGetPublicRepos()

  if (session.data?.user.provider !== 'github') {
    return (
      <Button
        onClick={() => signIn('github')}
        className="bg-gray-800 text-white">
        Sign in with Github to select a repo
      </Button>
    )
  }

  return (
    <div className="min-w-96 rounded-md border-2 border-gray-900 p-2">
      {selectedRepo === null ? (
        <div>
          <span className="pb-2 font-bold">Select a repo</span>
          <ScrollArea className="h-96 w-full" thumbClassname="bg-gray-400">
            <div className="flex flex-col items-start gap-2">
              <RepoList
                repos={publicReposData}
                isLoading={publicReposIsLoading}
                selectRepo={(params: GithubRepository) => onSelectRepo(params)}
              />
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div>
          <Button variant="outline" onClick={() => onSelectRepo(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="pl-2 font-bold">{`${selectedRepo.owner}/${selectedRepo.name}`}</span>
        </div>
      )}
    </div>
  )
}

type RepoListProps = {
  repos: GithubRepository[] | undefined
  isLoading: boolean
  selectRepo: (params: GithubRepository) => void
}

const RepoList = ({repos, isLoading, selectRepo}: RepoListProps) => {
  if (!repos && isLoading) return <span>Loading...</span>

  if (!repos || repos.length === 0) return <span>No public repos found</span>

  return repos.map((repo) => (
    <Button key={repo.id} onClick={() => selectRepo(repo)}>
      {repo.fullName}
    </Button>
  ))
}

export default GithubRepoSelect
