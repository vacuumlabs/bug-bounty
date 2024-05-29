'use client'

import {X} from 'lucide-react'
import {useSession} from 'next-auth/react'

import {signInWithGithub} from './utils'

import {Button} from '@/components/ui/Button'
import {useGetRepoBranches} from '@/lib/queries/github/getGitHub'
import {GithubRepository} from '@/server/actions/github/getGithub'
import {ScrollArea} from '@/components/ui/ScrollArea'

type BranchListProps = {
  branches: string[] | undefined
  isLoading: boolean
  selectBranch: (branch: string) => void
}

const BranchList = ({branches, isLoading, selectBranch}: BranchListProps) => {
  if (!branches && isLoading) return <span>Loading...</span>

  if (!branches || branches.length === 0) return <span>No branches found</span>

  return branches.map((branch) => (
    <Button
      variant="link"
      className="normal-case"
      key={branch}
      onClick={() => selectBranch(branch)}>
      {branch}
    </Button>
  ))
}

type GithubBranchSelectProps = {
  selectedRepo: GithubRepository
  selectedBranch: string | null
  onSelectBranch: (branch: string | null) => void
}

const GithubBranchSelect = ({
  selectedRepo,
  selectedBranch,
  onSelectBranch,
}: GithubBranchSelectProps) => {
  const session = useSession()

  const {data: branchesData, isLoading: branchesIsLoading} = useGetRepoBranches(
    {owner: selectedRepo.owner, repo: selectedRepo.name},
  )

  if (session.data?.user.provider !== 'github') {
    return (
      <Button onClick={signInWithGithub}>
        Sign in with Github to select a repo
      </Button>
    )
  }

  return (
    <div className="min-w-96 border border-white p-2">
      {selectedBranch == null ? (
        <ScrollArea className="h-96 w-full" thumbClassname="bg-gray-20">
          <div className="flex flex-col items-start">
            <BranchList
              branches={branchesData?.map((branch) => branch.name)}
              isLoading={branchesIsLoading}
              selectBranch={onSelectBranch}
            />
          </div>
        </ScrollArea>
      ) : (
        <div>
          <Button variant="outline" onClick={() => onSelectBranch(null)}>
            <X className="h-4 w-4" />
          </Button>
          <span className="pl-2">{selectedBranch}</span>
        </div>
      )}
    </div>
  )
}

export default GithubBranchSelect
