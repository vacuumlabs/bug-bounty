import {signIn} from 'next-auth/react'

import {toast} from '@/components/ui/Toast'

export const signInWithGithub = async () => {
  const response = await signIn('github', {redirect: false})

  if (!response) {
    return
  }
  const {ok, error} = response

  if (!ok) {
    console.error(error)
    toast({title: 'Failed to sign in with Github.'})
  }
}
