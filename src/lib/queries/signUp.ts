import {MutateOptions, useMutation} from '@tanstack/react-query'
import {signIn} from 'next-auth/react'

import {UserInputError} from '../types/error'

import {
  SignUpProps,
  signUpWithCredentials,
} from '@/server/actions/signUpWithCredentials'

export const useSignUp = (options?: MutateOptions<void, Error, SignUpProps>) =>
  useMutation({
    ...options,
    mutationFn: async (values: SignUpProps) => {
      const result = await signUpWithCredentials(values)

      if (result.type === 'error') {
        throw new UserInputError(result.message)
      }

      await signIn('email', {
        email: values.email,
        callbackUrl: '/profile/connect-wallet',
      })
    },
  })
