'use client'

import Image from 'next/image'
import {signIn} from 'next-auth/react'

import twitterLogo from '@public/images/oauth/twitter-logo.svg'
import googleLogo from '@public/images/oauth/google-logo.svg'
import githubLogo from '@public/images/oauth/github-logo.svg'

const OAuthButtons = () => {
  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => signIn('google', {callbackUrl: '/my-projects'})}
        className="flex h-12 w-96 items-center justify-center bg-white">
        <Image
          src={googleLogo as string}
          alt="Google logo"
          className="h-6 w-6"
          width={24}
          height={24}
        />
        <span className="pl-2 font-bold text-black">Sign Up with Google</span>
      </button>
      <button
        onClick={() => signIn('github', {callbackUrl: '/my-projects'})}
        className="flex h-12 w-96 items-center justify-center bg-white">
        <Image
          src={githubLogo as string}
          alt="Github logo"
          className="h-6 w-6"
          width={24}
          height={24}
        />
        <span className="pl-2 font-bold text-black">Sign Up with GitHub</span>
      </button>
      <button
        onClick={() => signIn('twitter', {callbackUrl: '/my-projects'})}
        className="flex h-12 w-96 items-center justify-center bg-white">
        <Image
          src={twitterLogo as string}
          alt="Twitter logo"
          className="h-6 w-6"
          width={24}
          height={24}
        />
        <span className="pl-2 font-bold text-black">Sign Up with Twitter</span>
      </button>
    </div>
  )
}

export default OAuthButtons
