import {redirect} from 'next/navigation'
import Link from 'next/link'

import VerifyWalletButton from '@/components/sections/profile/VerifyWalletButton'
import {getServerAuthSession} from '@/server/auth'
import {getUser} from '@/server/actions/getUser'
import {Button} from '@/components/ui/Button'

const ConnectWalletPage = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/api/auth/error?error=AccessDenied')
  }

  const user = await getUser()

  return (
    <main className="flex flex-col items-center gap-8 pt-[100px]">
      {user.walletAddress ? (
        <>
          <h1 className="text-2xl">Wallet connected</h1>
          <span>{`Wallet address: ${user.walletAddress}`}</span>
          <span className="mt-8 text-lg">Change connected wallet:</span>
          <VerifyWalletButton />
        </>
      ) : (
        <>
          <h1 className="text-2xl">
            Connect your wallet to add it to your account
          </h1>
          <VerifyWalletButton />
        </>
      )}
      <Button asChild variant="link">
        <Link href="/">Go home</Link>
      </Button>
    </main>
  )
}

export default ConnectWalletPage
