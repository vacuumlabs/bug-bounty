'use server'

import {Octokit} from 'octokit'
import {z} from 'zod'

import {requireGitHubAuth} from '@/server/utils/auth'
import {db} from '@/server/db'

export type GetPublicReposResponse = Awaited<ReturnType<typeof getPublicRepos>>

export const getPublicRepos = async () => {
  const session = await requireGitHubAuth()

  const account = await db.query.accounts.findFirst({
    columns: {access_token: true},
    where: (account, {eq, and}) =>
      and(eq(account.userId, session.user.id), eq(account.provider, 'github')),
  })

  if (!account) {
    throw new Error('GitHub account not found')
  }

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

export type GetRepoFilesResponse = Awaited<ReturnType<typeof getRepoFiles>>

const getRepoFilesParamsSchema = z.object({
  repo: z.string(),
  owner: z.string(),
  defaultBranch: z.string(),
})

export type GetRepoFilesParams = z.infer<typeof getRepoFilesParamsSchema>

export const getRepoFiles = async (request: GetRepoFilesParams) => {
  const session = await requireGitHubAuth()

  const result = getRepoFilesParamsSchema.safeParse(request)

  if (!result.success) {
    throw new Error('Invalid request')
  }

  const {repo, owner, defaultBranch} = result.data

  const account = await db.query.accounts.findFirst({
    columns: {access_token: true},
    where: (account, {eq, and}) =>
      and(eq(account.userId, session.user.id), eq(account.provider, 'github')),
  })

  if (!account) {
    throw new Error('GitHub account not found')
  }

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
