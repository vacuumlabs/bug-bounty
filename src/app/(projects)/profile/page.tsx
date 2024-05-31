import Link from 'next/link'

import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetUser} from '@/lib/queries/user/getUser'
import Profile from '@/components/sections/profile/Profile'
import {Button} from '@/components/ui/Button'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'
import Separator from '@/components/ui/Separator'
import {PATHS} from '@/lib/utils/common/paths'

const ProfilePage = async () => {
  const session = await requirePageSession()

  await prefetchGetUser(session.user.id)

  return (
    <main className="flex max-w-[1000px] flex-col items-start gap-8 px-24 py-12">
      <h1 className="text-3xl font-semibold">My profile</h1>
      <HydrationBoundary>
        <Profile />
      </HydrationBoundary>
      <Separator className="mt-10" />
      <Button asChild variant="outline">
        <Link href={PATHS.home}>Home</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/finding/new">Add finding</Link>
      </Button>
    </main>
  )
}

export default ProfilePage
