'use client'

import Image from 'next/image'
import {signIn} from 'next-auth/react'

import twitterLogo from '@public/images/oauth/twitter-logo.svg'
import googleLogo from '@public/images/oauth/google-logo.svg'
import githubLogo from '@public/images/oauth/github-logo.svg'
import {PATHS} from '@/lib/utils/common/paths'

type OAuthButtonsProps = {
  callbackUrl: string | undefined
}

const OAuthButtons = ({callbackUrl}: OAuthButtonsProps) => {
  const redirectUrl = `${PATHS.selectRole}?callbackUrl=${callbackUrl ?? PATHS.home}`

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() =>
          signIn('google', {
            callbackUrl: redirectUrl,
          })
        }
        className="flex h-12 w-96 items-center justify-center bg-white">
        <Image
          src={googleLogo as string}
          alt="Google logo"
          className="h-6 w-6"
          width={24}
          height={24}
        />
        <span className="pl-2 font-bold text-black">Sign In with Google</span>
      </button>
      <button
        onClick={() => signIn('github', {callbackUrl: redirectUrl})}
        className="flex h-12 w-96 items-center justify-center bg-white">
        <Image
          src={githubLogo as string}
          alt="Github logo"
          className="h-6 w-6"
          width={24}
          height={24}
        />
        <span className="pl-2 font-bold text-black">Sign In with GitHub</span>
      </button>
      <button
        onClick={() => signIn('twitter', {callbackUrl: redirectUrl})}
        className="flex h-12 w-96 items-center justify-center bg-white">
        <Image
          src={twitterLogo as string}
          alt="Twitter logo"
          className="h-6 w-6"
          width={24}
          height={24}
        />
        <span className="pl-2 font-bold text-black">Sign In with Twitter</span>
      </button>
    </div>
  )
}

export default OAuthButtons
