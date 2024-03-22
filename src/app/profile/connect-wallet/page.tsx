import {redirect} from 'next/navigation'

import VerifyWalletButton from '@/components/sections/profile/VerifyWalletButton'
import {getServerAuthSession} from '@/server/auth'

const ConnectWalletPage = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/api/auth/error?error=AccessDenied')
  }

  return (
    <main className="flex flex-col items-center gap-8 pt-[100px]">
      <h1 className="text-2xl">
        Connect your wallet to add it to your account
      </h1>
      <VerifyWalletButton />
    </main>
  )
}

export default ConnectWalletPage
