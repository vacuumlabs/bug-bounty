import {createQueryKeyStore} from '@lukemorales/query-key-factory'

import {GetRewardsParams} from '@/server/actions/getReward'

export const queryKeys = createQueryKeyStore({
  users: {
    detail: (userId: string | undefined) => [userId],
  },
  rewards: {
    all: (params: GetRewardsParams) => [params],
  },
})
