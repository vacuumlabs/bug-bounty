'use client'

import {X} from 'lucide-react'
import {useSession} from 'next-auth/react'

import {signInWithGithub} from './utils'

import {Button} from '@/components/ui/Button'
import {useGetPublicRepos} from '@/lib/queries/github/getGitHub'
import {GithubRepository} from '@/server/actions/github/getGithub'
import {ScrollArea} from '@/components/ui/ScrollArea'

type RepoListProps = {
  repos: GithubRepository[] | undefined
  isLoading: boolean
  selectRepo: (params: GithubRepository) => void
}

const RepoList = ({repos, isLoading, selectRepo}: RepoListProps) => {
  if (!repos && isLoading) return <span>Loading...</span>

  if (!repos || repos.length === 0) return <span>No public repos found</span>

  return repos.map((repo) => (
    <Button
      variant="link"
      className="normal-case"
      key={repo.id}
      onClick={() => selectRepo(repo)}>
      {repo.fullName}
    </Button>
  ))
}

type GithubRepoSelectProps = {
  selectedRepo: GithubRepository | null
  onSelectRepo: (repoUrl: GithubRepository | null) => void
}

const GithubRepoSelect = ({
  selectedRepo,
  onSelectRepo,
}: GithubRepoSelectProps) => {
  const session = useSession()

  const {data: publicReposData, isLoading: publicReposIsLoading} =
    useGetPublicRepos()

  if (session.data?.user.provider !== 'github') {
    return (
      <Button onClick={signInWithGithub}>
        Sign in with Github to select a repo
      </Button>
    )
  }

  return (
    <div className="min-w-96 border border-white p-2">
      {selectedRepo == null ? (
        <div>
          <ScrollArea className="h-96 w-full" thumbClassname="bg-gray-20">
            <div className="flex flex-col items-start">
              <RepoList
                repos={publicReposData}
                isLoading={publicReposIsLoading}
                selectRepo={onSelectRepo}
              />
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div>
          <Button variant="outline" onClick={() => onSelectRepo(null)}>
            <X className="h-4 w-4" />
          </Button>
          <span className="pl-2">{`${selectedRepo.owner}/${selectedRepo.name}`}</span>
        </div>
      )}
    </div>
  )
}

export default GithubRepoSelect
