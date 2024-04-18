import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetUser} from '@/lib/queries/user/getUser'
import RegisterWalletAddress from '@/components/sections/profile/RegisterWalletAddress'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'

const ConnectWalletPage = async () => {
  const session = await requirePageSession()

  await prefetchGetUser(session.user.id)

  return (
    <main className="flex flex-col items-center gap-8 pt-[100px]">
      <HydrationBoundary>
        <RegisterWalletAddress />
      </HydrationBoundary>
      <Button asChild variant="link">
        <Link href="/profile">Go home</Link>
      </Button>
    </main>
  )
}

export default ConnectWalletPage
