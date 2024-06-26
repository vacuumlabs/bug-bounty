import {createQueryKeyStore} from '@lukemorales/query-key-factory'

import {type GetRewardsParams} from '@/server/actions/reward/getReward'
import {type GetPublicContestsParams} from '@/server/actions/contest/getPublicContests'
import {type GetDeduplicatedFindingsParams} from '@/server/actions/deduplicatedFinding/getDeduplicatedFinding'
import {
  GetRepoBranchesParams,
  GetRepoFilesParams,
} from '@/server/actions/github/getGithub'
import {GetPublicContestCountsParams} from '@/server/actions/contest/getPublicContestCounts'
import {GetMyContestsParams} from '@/server/actions/contest/getMyContests'
import {GetMyFindingsParams} from '@/server/actions/finding/getMyFindings'
import {GetMyFindingsRewardsParams} from '@/server/actions/reward/getMyFindingsRewards'
import {GetContestLeaderboardParams} from '@/server/actions/contest/getContestLeaderboard'

export const queryKeys = createQueryKeyStore({
  users: {
    detail: (userId: string | undefined) => [userId],
  },
  rewards: {
    all: (params: GetRewardsParams) => [params],
    mine: (userId: string | undefined, params: GetMyFindingsRewardsParams) => [
      userId,
      params,
    ],
    totalSize: (userId: string | undefined) => [userId],
    calculated: (contestId: string) => [contestId],
  },
  contests: {
    one: (contestId: string | undefined) => [contestId],
    leaderboard: (params: GetContestLeaderboardParams) => [params],
    leaderboardCount: (contestId: string | undefined) => [contestId],
    mine: (params: GetMyContestsParams) => [params],
    reportCounts: null,
    public: (params: GetPublicContestsParams) => [params],
    publicCounts: (params: GetPublicContestCountsParams) => [params],
  },
  findings: {
    mine: (params: GetMyFindingsParams) => [params],
    counts: null,
  },
  deduplicatedFindings: {
    all: (params: GetDeduplicatedFindingsParams) => [params],
  },
  gitHub: {
    publicRepos: (userId: string | undefined) => [userId],
    repoBranches: (params: GetRepoBranchesParams | undefined) => [params],
    repoFiles: (params: GetRepoFilesParams | undefined) => [params],
  },
})
