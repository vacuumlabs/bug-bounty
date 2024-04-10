import Link from 'next/link'

import SignOutButton from '@/components/ui/SignOutButon'
import {requirePageSession} from '@/server/utils/auth'
import {prefetchGetUser} from '@/lib/queries/getUser'
import Profile from '@/components/sections/profile/Profile'
import {Button} from '@/components/ui/Button'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'

const ProfilePage = async () => {
  const session = await requirePageSession()

  await prefetchGetUser(session.user.id)

  return (
    <main className="flex max-w-[1000px] flex-col items-start gap-8 px-20 pt-[100px]">
      <h1 className="text-2xl">My profile</h1>
      <HydrationBoundary>
        <Profile />
      </HydrationBoundary>
      <Button asChild variant="link">
        <Link href="/">Home</Link>
      </Button>
      <SignOutButton variant="link" callbackUrl="/">
        Sign out
      </SignOutButton>
    </main>
  )
}

export default ProfilePage
