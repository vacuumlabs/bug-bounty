'use client'

import {useState} from 'react'
import {ArrowLeft} from 'lucide-react'
import {signIn, useSession} from 'next-auth/react'

import {Button} from '@/components/ui/Button'
import {
  useGetPublicRepos,
  useGetRepoFiles,
} from '@/lib/queries/github/getGitHub'
import {
  GetPublicReposResponse,
  GetRepoFilesParams,
  GetRepoFilesResponse,
} from '@/server/actions/github/getGithub'
import {Checkbox} from '@/components/ui/Checkbox'
import {ScrollArea} from '@/components/ui/ScrollArea'

const GithubFileSelect = () => {
  const session = useSession()

  const [selectedRepo, setSelectedRepo] = useState<GetRepoFilesParams | null>(
    null,
  )
  const {data: publicReposData, isLoading: publicReposIsLoading} =
    useGetPublicRepos()
  const {data: repoFilesData, isLoading: repoFilesIsLoading} = useGetRepoFiles(
    selectedRepo ?? undefined,
  )

  if (session.data?.user.provider !== 'github') {
    return (
      <Button
        onClick={() => signIn('github')}
        className="bg-gray-800 text-white">
        Sign in with Github to select repo files
      </Button>
    )
  }

  return (
    <div className="min-w-96 rounded-md border-2 border-gray-900 p-2">
      <div className="pb-2">
        {selectedRepo === null ? (
          <span className="font-bold">Select a repo</span>
        ) : (
          <div>
            <Button variant="outline" onClick={() => setSelectedRepo(null)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="pl-2 font-bold">{`${selectedRepo.owner}/${selectedRepo.repo}`}</span>
          </div>
        )}
      </div>
      <ScrollArea className="h-96 w-full" thumbClassname="bg-gray-400">
        <div className="flex flex-col items-start gap-2">
          {selectedRepo === null ? (
            <RepoList
              repos={publicReposData}
              isLoading={publicReposIsLoading}
              selectRepo={(params: GetRepoFilesParams) =>
                setSelectedRepo(params)
              }
            />
          ) : (
            <FileTree fileTree={repoFilesData} isLoading={repoFilesIsLoading} />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

type RepoListProps = {
  repos: GetPublicReposResponse | undefined
  isLoading: boolean
  selectRepo: (params: GetRepoFilesParams) => void
}

const RepoList = ({repos, isLoading, selectRepo}: RepoListProps) => {
  if (!repos && isLoading) return <span>Loading...</span>

  if (!repos || repos.length === 0) return <span>No public repos found</span>

  return repos.map((repo) => (
    <Button
      key={repo.id}
      onClick={() =>
        selectRepo({
          owner: repo.owner,
          repo: repo.name,
          defaultBranch: repo.defaultBranch,
        })
      }>
      {repo.fullName}
    </Button>
  ))
}

type FileTreeProps = {
  fileTree: GetRepoFilesResponse | undefined | null
  isLoading: boolean
}

const FileTree = ({fileTree, isLoading}: FileTreeProps) => {
  if (isLoading) return <span>Loading...</span>

  if (!fileTree || fileTree.length === 0) return <span>No files found</span>

  return fileTree.map((file) => (
    <div key={file.path}>
      <Checkbox id={file.path} />
      <label htmlFor={file.path} className="pl-2">
        {file.path}
      </label>
    </div>
  ))
}

export default GithubFileSelect
