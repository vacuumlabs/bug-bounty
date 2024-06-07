import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetUser} from '@/lib/queries/user/getUser'
import RegisterWalletAddress from '@/components/sections/profile/RegisterWalletAddress'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {PATHS} from '@/lib/utils/common/paths'

const ConnectWalletPage = async ({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) => {
  const session = await requirePageSession()

  const isFromConfirmPath = searchParams?.source === 'confirmPath'

  await prefetchGetUser(session.user.id)

  return (
    <main className="flex flex-col items-center gap-8 py-[155px]">
      <HydrationBoundary>
        <RegisterWalletAddress />
      </HydrationBoundary>
      <Button asChild variant="outline" className="mt-12">
        <Link href={isFromConfirmPath ? PATHS.myProjects : PATHS.profile}>
          {isFromConfirmPath ? 'SKIP THIS STEP' : 'Go home'}
        </Link>
      </Button>
    </main>
  )
}

export default ConnectWalletPage
