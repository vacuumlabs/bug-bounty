import {useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'
import {withApiErrorHandler} from '../../utils/common/error'

import {setUserRole} from '@/server/actions/user/setUserRole'

export const useSetUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withApiErrorHandler(setUserRole),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail._def,
      })
    },
  })
}
