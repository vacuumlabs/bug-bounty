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
import {
  GetMyFindingParams,
  GetMyFindingsParams,
} from '@/server/actions/finding/getMyFinding'
import {GetMyFindingsRewardsParams} from '@/server/actions/reward/getMyFindingsRewards'
import {GetContestLeaderboardParams} from '@/server/actions/contest/getContestLeaderboard'
import {
  GetContestFindingsParams,
  GetFindingParams,
  GetFindingsParams,
  GetFindingsToDeduplicateRequest,
} from '@/server/actions/finding/getFinding'
import {GetJudgeContestsParams} from '@/server/actions/contest/getJudgeContests'
import {GetJudgeRewardsParams} from '@/server/actions/reward/getJudgeRewards'

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
    calculated: (contestId: string) => [contestId],
    judgeRewardCounts: null,
    judgeRewards: (params: GetJudgeRewardsParams) => [params],
  },
  contests: {
    one: (contestId: string | undefined) => [contestId],
    leaderboard: (params: GetContestLeaderboardParams) => [params],
    mine: (params: GetMyContestsParams) => [params],
    reportCounts: null,
    public: (params: GetPublicContestsParams) => [params],
    publicCounts: (params: GetPublicContestCountsParams) => [params],
    judgesContestCounts: null,
    judgeContests: (params: GetJudgeContestsParams) => [params],
  },
  findings: {
    mine: (userId: string | undefined, params: GetMyFindingsParams) => [
      userId,
      params,
    ],
    mineOne: (params: GetMyFindingParams) => [params],
    counts: null,
    byContest: (params: GetContestFindingsParams) => [params],
    byDeduplicatedFinding: (params: GetFindingsParams) => [params],
    one: (params: GetFindingParams) => [params],
    toDeduplicate: (params: GetFindingsToDeduplicateRequest) => [params],
  },
  deduplicatedFindings: {
    all: (params: GetDeduplicatedFindingsParams) => [params],
    one: (deduplicatedFindingId: string) => [deduplicatedFindingId],
    totalSize: (contestId: string) => [contestId],
  },
  gitHub: {
    publicRepos: (userId: string | undefined) => [userId],
    repoBranches: (params: GetRepoBranchesParams | undefined) => [params],
    repoFiles: (params: GetRepoFilesParams | undefined) => [params],
  },
  judges: {
    contestCounts: null,
  },
})
