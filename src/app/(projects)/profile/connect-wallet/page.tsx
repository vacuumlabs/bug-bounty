import Link from 'next/link'
import {redirect} from 'next/navigation'

import {Button} from '@/components/ui/Button'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetUser} from '@/lib/queries/user/getUser'
import RegisterWalletAddress from '@/components/sections/profile/RegisterWalletAddress'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {PATHS} from '@/lib/utils/common/paths'
import {getUserAction} from '@/server/actions/user/getUser'
import {getRelativePathFromAbsolutePath} from '@/lib/utils/common/url'

const ConnectWalletPage = async ({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) => {
  const session = await requirePageSession()
  const user = await getUserAction()
  const callbackUrl = searchParams?.callbackUrl as string | undefined

  if (callbackUrl && user.walletAddress) {
    redirect(callbackUrl)
  }

  await prefetchGetUser(session.user.id)

  return (
    <main className="flex flex-col items-center gap-8 py-[155px]">
      <HydrationBoundary>
        <RegisterWalletAddress />
      </HydrationBoundary>
      <Button asChild variant="outline" className="mt-12">
        <Link
          href={
            callbackUrl
              ? getRelativePathFromAbsolutePath(callbackUrl)
              : PATHS.profile
          }>
          {callbackUrl ? 'SKIP THIS STEP' : 'Go home'}
        </Link>
      </Button>
    </main>
  )
}

export default ConnectWalletPage
