import {createQueryKeyStore} from '@lukemorales/query-key-factory'

export const queryKeys = createQueryKeyStore({
  users: {
    detail: (userId: string | undefined) => [userId],
  },
})
