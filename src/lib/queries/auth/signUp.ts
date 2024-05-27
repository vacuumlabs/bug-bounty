import {MutateOptions, useMutation} from '@tanstack/react-query'
import {signIn} from 'next-auth/react'

import {handleApiErrors} from '@/lib/utils/common/error'
import {
  SignUpRequest,
  signUpWithCredentials,
} from '@/server/actions/auth/signUpWithCredentials'
import {PATHS} from '@/lib/utils/common/paths'

export const useSignUp = (
  options?: MutateOptions<void, Error, SignUpRequest>,
) =>
  useMutation({
    ...options,
    mutationFn: async (values: SignUpRequest) => {
      const result = await signUpWithCredentials(values)

      handleApiErrors(result)

      await signIn('email', {
        email: values.email,
        callbackUrl: PATHS.connectWallet,
      })
    },
  })
