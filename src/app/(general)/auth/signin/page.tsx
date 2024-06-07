import Image from 'next/image'

import backgroundImage from '@public/images/background-graphic.png'
import OAuthButtons from '@/components/sections/auth/OAuthButtons'

const SignInPage = () => {
  return (
    <main className="relative flex flex-col justify-between py-[155px]">
      <Image
        src={backgroundImage}
        alt="Background image"
        width={514}
        className="opacity-10"
        style={{
          position: 'absolute',
          right: 0,
          top: -136,
          zIndex: -1,
        }}
      />
      <div className="flex flex-col items-center justify-center px-24">
        <h1 className="whitespace-pre-line text-headlineL font-bold uppercase">
          Login
        </h1>
        <p className="mt-3">Choose an account to log in with</p>
        <div className="mt-12">
          <OAuthButtons />
        </div>
      </div>
    </main>
  )
}

export default SignInPage
