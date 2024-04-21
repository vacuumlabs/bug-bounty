import {useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'
import {withApiErrorHandler} from '../../utils/common/error'

import {setUserAlias} from '@/server/actions/user/setUserAlias'

export const useSetUserAlias = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withApiErrorHandler(setUserAlias),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail._def,
      })
    },
  })
}
