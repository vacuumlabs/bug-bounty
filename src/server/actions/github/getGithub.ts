'use server'

import {Octokit} from 'octokit'
import {z} from 'zod'

import {requireGitHubAuth} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'

export type GetPublicReposResponse = Awaited<
  ReturnType<typeof getPublicReposAction>
>

export type GithubRepository = GetPublicReposResponse[number]

const getPublicReposAction = async () => {
  const {account} = await requireGitHubAuth()

  const octokit = new Octokit({
    auth: account.access_token,
  })

  const {data} = await octokit.rest.repos.listForAuthenticatedUser()

  return data
    .filter((repo) => !repo.private)
    .map((repo) => ({
      id: repo.id,
      fullName: repo.full_name,
      owner: repo.owner.login,
      name: repo.name,
      defaultBranch: repo.default_branch,
      url: repo.html_url,
    }))
}

export const getPublicRepos = serializeServerErrors(getPublicReposAction)

export type GetRepoFilesResponse = Awaited<
  ReturnType<typeof getRepoFilesAction>
>

const getRepoFilesParamsSchema = z.object({
  repo: z.string(),
  owner: z.string(),
  defaultBranch: z.string(),
})

export type GetRepoFilesParams = z.infer<typeof getRepoFilesParamsSchema>

const getRepoFilesAction = async (request: GetRepoFilesParams) => {
  const {account} = await requireGitHubAuth()

  const {repo, owner, defaultBranch} = getRepoFilesParamsSchema.parse(request)

  const octokit = new Octokit({
    auth: account.access_token,
  })

  const tree = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch: defaultBranch,
  })

  const {data} = await octokit.request(
    'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
    {
      owner,
      repo,
      tree_sha: tree.data.commit.sha,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
      recursive: 'true',
    },
  )

  return data.tree
}

export const getRepoFiles = serializeServerErrors(getRepoFilesAction)