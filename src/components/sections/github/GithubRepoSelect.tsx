'use client'

import {useState} from 'react'
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
  isFetching: boolean
  selectRepo: (params: GithubRepository) => void
}

const RepoList = ({
  repos,
  isLoading,
  isFetching,
  selectRepo,
}: RepoListProps) => {
  if (isLoading || isFetching) return <span>Loading...</span>

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
  const [page, setPage] = useState(1)

  const {
    data: publicReposResponse,
    isLoading: publicReposIsLoading,
    isFetching,
  } = useGetPublicRepos({page})

  const repos = publicReposResponse?.repos ?? []
  const isLastPage = publicReposResponse?.isLastPage ?? true

  const hasPrevPage = page > 1

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
                repos={repos}
                isLoading={publicReposIsLoading}
                selectRepo={onSelectRepo}
                isFetching={isFetching}
              />
            </div>
          </ScrollArea>

          <div className="mt-2 flex w-full items-center justify-between">
            <Button
              variant="ghost"
              disabled={!hasPrevPage || isFetching}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
              Previous
            </Button>

            <span className="text-muted-foreground text-sm">Page {page}</span>

            <Button
              variant="ghost"
              disabled={isLastPage || isFetching}
              onClick={() => setPage((prev) => prev + 1)}>
              Next
            </Button>
          </div>
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
