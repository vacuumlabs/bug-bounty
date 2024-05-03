import {createQueryKeyStore} from '@lukemorales/query-key-factory'

import {type GetRewardsParams} from '@/server/actions/reward/getReward'
import {type GetPublicContestsParams} from '@/server/actions/contest/getContests'
import {type GetDeduplicatedFindingsParams} from '@/server/actions/deduplicatedFinding/getDeduplicatedFinding'
import {GetRepoFilesParams} from '@/server/actions/github/getGithub'

export const queryKeys = createQueryKeyStore({
  users: {
    detail: (userId: string | undefined) => [userId],
  },
  rewards: {
    all: (params: GetRewardsParams) => [params],
    calculated: (contestId: string) => [contestId],
  },
  contests: {
    public: (params: GetPublicContestsParams) => [params],
  },
  deduplicatedFindings: {
    all: (params: GetDeduplicatedFindingsParams) => [params],
  },
  gitHub: {
    publicRepos: (userId: string | undefined) => [userId],
    repoFiles: (params: GetRepoFilesParams) => [params],
  },
})
