'use client'

import {useSession} from 'next-auth/react'
import {CheckedState} from '@radix-ui/react-checkbox'

import {signInWithGithub} from './utils'

import {Button} from '@/components/ui/Button'
import {useGetRepoFiles} from '@/lib/queries/github/getGitHub'
import {
  GetRepoFilesParams,
  GetRepoFilesResponse,
  GithubRepository,
} from '@/server/actions/github/getGithub'
import {CheckboxWithLabel} from '@/components/ui/Checkbox'
import {ScrollArea} from '@/components/ui/ScrollArea'

type FileTreeProps = {
  fileTree: GetRepoFilesResponse | undefined | null
  isLoading: boolean
  selectedFilePaths: string[]
  onSelectFilePaths: (newFiles: string[]) => void
}

const FileTree = ({
  fileTree,
  isLoading,
  selectedFilePaths,
  onSelectFilePaths,
}: FileTreeProps) => {
  if (isLoading) return <span>Loading...</span>

  if (!fileTree || fileTree.length === 0) return <span>No files found</span>

  const handleCheckChange = (
    checked: CheckedState,
    path: string | undefined,
  ) => {
    if (!path) {
      return
    }

    if (checked) {
      onSelectFilePaths([...selectedFilePaths, path])
    } else {
      onSelectFilePaths(selectedFilePaths.filter((file) => file !== path))
    }
  }

  const filteredFileTree = fileTree.filter((file) => file.path != undefined)

  return filteredFileTree.map((file) => (
    <CheckboxWithLabel
      key={file.path}
      id={file.path}
      checked={selectedFilePaths.includes(file.path ?? '')}
      onCheckedChange={(checked) => handleCheckChange(checked, file.path)}
      label={file.path}
    />
  ))
}

type SelectedRepo = Pick<GithubRepository, 'owner' | 'defaultBranch' | 'name'>

type GithubFileSelectProps = {
  selectedRepo: SelectedRepo | null
  selectedFiles: string[] | null | undefined
  onSelectFiles: (files: string[]) => void
}

const getRepoFilesParams = (
  selectedRepo: SelectedRepo | null,
): GetRepoFilesParams | undefined => {
  if (!selectedRepo) {
    return
  }
  const {name, owner, defaultBranch} = selectedRepo
  return {repo: name, owner, defaultBranch}
}

const GithubFileSelect = ({
  selectedRepo,
  selectedFiles,
  onSelectFiles,
}: GithubFileSelectProps) => {
  const session = useSession()

  const {data: repoFilesData, isLoading: repoFilesIsLoading} = useGetRepoFiles(
    getRepoFilesParams(selectedRepo),
  )

  if (session.data?.user.provider !== 'github') {
    return (
      <Button
        onClick={signInWithGithub}
        className="flex bg-gray-800 text-white">
        Sign in with Github to select files
      </Button>
    )
  }

  return (
    <div className="min-w-96 rounded-md border border-slate-200 p-2">
      {selectedRepo == null ? (
        <span>No repo selected</span>
      ) : (
        <ScrollArea className="h-96 w-full" thumbClassname="bg-gray-400">
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-col">
              <span className="pb-2 font-bold">Select files to include</span>
              <FileTree
                fileTree={repoFilesData}
                isLoading={repoFilesIsLoading}
                selectedFilePaths={selectedFiles ?? []}
                onSelectFilePaths={onSelectFiles}
              />
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default GithubFileSelect