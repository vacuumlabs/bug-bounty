import {MutateOptions, useMutation} from '@tanstack/react-query'
import {signIn} from 'next-auth/react'

import {handlePossibleFormError} from '@/lib/utils/common/error'
import {
  SignUpProps,
  signUpWithCredentials,
} from '@/server/actions/auth/signUpWithCredentials'

export const useSignUp = (options?: MutateOptions<void, Error, SignUpProps>) =>
  useMutation({
    ...options,
    mutationFn: async (values: SignUpProps) => {
      const result = await signUpWithCredentials(values)

      handlePossibleFormError(result)

      await signIn('email', {
        email: values.email,
        callbackUrl: '/profile/connect-wallet',
      })
    },
  })
