import Link from 'next/link'
import {redirect} from 'next/navigation'

import {Button} from '@/components/ui/Button'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetUser} from '@/lib/queries/user/getUser'
import RegisterWalletAddress from '@/components/sections/profile/RegisterWalletAddress'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import {PATHS} from '@/lib/utils/common/paths'
import {getUserAction} from '@/server/actions/user/getUser'
import {SearchParams} from '@/lib/types/general'

const ConnectWalletPage = async ({
  searchParams,
}: {
  searchParams?: SearchParams
}) => {
  const session = await requirePageSession()
  const user = await getUserAction()
  const callbackUrl = searchParams?.callbackUrl as string | undefined

  if (callbackUrl && user.walletAddress) {
    redirect(callbackUrl)
  }

  await prefetchGetUser(session.user.id)

  return (
    <main className="flex flex-col items-center py-[155px]">
      <HydrationBoundary>
        <RegisterWalletAddress />
      </HydrationBoundary>
      <Button asChild variant="outline" className="mt-12">
        <Link href={callbackUrl ?? PATHS.profile} className="uppercase">
          {callbackUrl ? 'Skip this step' : 'Back to profile'}
        </Link>
      </Button>
    </main>
  )
}

export default ConnectWalletPage
