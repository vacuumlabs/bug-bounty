'use client'

import {signInWithGithub} from '../../github/utils'

import {Button} from '@/components/ui/Button'

type GithubSignInButtonProps = {
  className?: string
}

const GithubSignInButton = ({className}: GithubSignInButtonProps) => (
  <Button onClick={signInWithGithub} className={className}>
    Sign in with Github to continue
  </Button>
)

export default GithubSignInButton
