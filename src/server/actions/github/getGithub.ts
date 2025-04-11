'use server'

import {Octokit} from 'octokit'
import {z} from 'zod'

import {requireGitHubAuth} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'

export type GetPublicReposResponse = Awaited<
  ReturnType<typeof getPublicReposAction>
>

export type GithubRepository = GetPublicReposResponse['repos'][number]

const getPublicReposSchema = z.object({
  page: z.number().default(0),
})

export type GetPublicReposParams = z.infer<typeof getPublicReposSchema>

const getPublicReposAction = async (request: GetPublicReposParams) => {
  const {account} = await requireGitHubAuth()

  const octokit = new Octokit({
    auth: account.access_token,
  })

  const {data, headers} = await octokit.rest.repos.listForAuthenticatedUser({
    page: request.page,
    visibility: 'public',
    sort: 'updated',
    per_page: 30,
  })

  const repos = data
    .filter((repo) => !repo.private)
    .map((repo) => ({
      id: repo.id,
      fullName: repo.full_name,
      owner: repo.owner.login,
      name: repo.name,
      defaultBranch: repo.default_branch,
      url: repo.html_url,
    }))

  const isLastPage = !headers.link?.includes('rel="next"')

  return {repos, isLastPage}
}

export const getPublicRepos = serializeServerErrors(getPublicReposAction)

const getRepoBranchesSchema = z.object({
  owner: z.string(),
  repo: z.string(),
})

export type GetRepoBranchesParams = z.infer<typeof getRepoBranchesSchema>

const getRepoBranchesAction = async (request: GetRepoBranchesParams) => {
  const {account} = await requireGitHubAuth()

  const {owner, repo} = getRepoBranchesSchema.parse(request)

  const octokit = new Octokit({
    auth: account.access_token,
  })

  const {data} = await octokit.rest.repos.listBranches({
    owner,
    repo,
  })

  return data
}

export const getRepoBranches = serializeServerErrors(getRepoBranchesAction)

export type GetRepoFilesResponse = Awaited<
  ReturnType<typeof getRepoFilesAction>
>

const getRepoFilesParamsSchema = z.object({
  repo: z.string(),
  owner: z.string(),
  branch: z.string(),
})

export type GetRepoFilesParams = z.infer<typeof getRepoFilesParamsSchema>

const getRepoFilesAction = async (request: GetRepoFilesParams) => {
  const {account} = await requireGitHubAuth()

  const {repo, owner, branch} = getRepoFilesParamsSchema.parse(request)

  const octokit = new Octokit({
    auth: account.access_token,
  })

  const tree = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
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
