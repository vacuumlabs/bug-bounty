import Link from 'next/link'

import {getServerAuthSession, isJudge} from '@/server/utils/auth'
import {Button} from '@/components/ui/Button'
import SignOutButton from '@/components/ui/SignOutButon'
import JudgeRewardsList from '@/components/sections/judge/JudgeRewardsList'
import {prefetchGetRewards} from '@/lib/queries/reward/getRewards'
import HydrationBoundary from '@/components/helpers/HydrationBoundary'

const Home = async () => {
  const session = await getServerAuthSession()
  await prefetchGetRewards({limit: 20})

  return (
    <main className="flex flex-col items-center justify-between p-32">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="pb-20 text-4xl font-semibold">
          Welcome to the new Cardano Bug Bounty platform!
        </p>
        <p className="text-center text-2xl text-black">
          {session && (
            <span>Logged in as {session.user.name ?? session.user.email}</span>
          )}
        </p>
        {session ? (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={'/profile'}>My profile</Link>
            </Button>
            <SignOutButton variant="outline" callbackUrl="/">
              Sign out
            </SignOutButton>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild>
              <Link href={'/api/auth/signin'}>Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={'/auth/signup'}>Sign up</Link>
            </Button>
          </div>
        )}
      </div>
      {isJudge(session) && (
        <HydrationBoundary>
          <JudgeRewardsList />
        </HydrationBoundary>
      )}
    </main>
  )
}

export default Home
