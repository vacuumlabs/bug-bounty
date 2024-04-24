import {createQueryKeyStore} from '@lukemorales/query-key-factory'

import {GetRewardsParams} from '@/server/actions/reward/getReward'

export const queryKeys = createQueryKeyStore({
  users: {
    detail: (userId: string | undefined) => [userId],
  },
  rewards: {
    all: (params: GetRewardsParams) => [params],
    calculated: (contestId: string) => [contestId],
  },
})
