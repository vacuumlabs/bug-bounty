import {MutateOptions, useMutation} from '@tanstack/react-query'
import {signIn} from 'next-auth/react'

import {handleApiErrors} from '@/lib/utils/common/error'
import {
  SignUpParams,
  signUpWithCredentials,
} from '@/server/actions/auth/signUpWithCredentials'

export const useSignUp = (options?: MutateOptions<void, Error, SignUpParams>) =>
  useMutation({
    ...options,
    mutationFn: async (values: SignUpParams) => {
      const result = await signUpWithCredentials(values)

      handleApiErrors(result)

      await signIn('email', {
        email: values.email,
        callbackUrl: '/profile/connect-wallet',
      })
    },
  })
