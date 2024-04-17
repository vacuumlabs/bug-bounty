import {useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from './keys'
import {handlePossibleFormError} from '../utils/common/error'

import {setUserAlias} from '@/server/actions/setUserAlias'

export const useSetUserAlias = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (alias: string | null) => {
      const result = await setUserAlias(alias)
      return handlePossibleFormError(result)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail._def,
      })
    },
  })
}
