import {useSession} from 'next-auth/react'
import {useMutation, useQueryClient} from '@tanstack/react-query'

import {queryKeys} from '../keys'
import {withApiErrorHandler} from '../../utils/common/error'

import {setUserRole} from '@/server/actions/user/setUserRole'
import {UserRole} from '@/server/db/models'

export const useSetUserRole = () => {
  const queryClient = useQueryClient()
  const {update} = useSession()

  return useMutation({
    mutationFn: withApiErrorHandler(
      async (request: UserRole.AUDITOR | UserRole.PROJECT_OWNER) => {
        await update()

        return setUserRole(request)
      },
    ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail._def,
      })
    },
  })
}
