import {Suspense} from 'react'

import VerifyEmailForm from '@/components/sections/profile/VerifyEmailForm'

const VerifyEmailPage = () => {
  return (
    <main className="flex flex-col items-center gap-8 pt-[100px]">
      <h1 className="text-2xl">Verify your email</h1>
      <p>
        Sign in with your email address. We’ll send you a magic link to verify.
      </p>
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </main>
  )
}

export default VerifyEmailPage
