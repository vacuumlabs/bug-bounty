import Link from 'next/link'

import {getServerAuthSession} from '@/server/utils/auth'
import {Button} from '@/components/ui/Button'
import MarkdownEditor from '@/components/markdown/MarkdownEditor'
import SignOutButton from '@/components/ui/SignOutButon'

const Home = async () => {
  const session = await getServerAuthSession()

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-black">
          {session && (
            <span>Logged in as {session.user.name ?? session.user.email}</span>
          )}
        </p>
        {session ? (
          <>
            <Button asChild variant="link">
              <Link href={'/profile'}>My profile</Link>
            </Button>
            <SignOutButton variant="link" callbackUrl="/">
              Sign out
            </SignOutButton>
          </>
        ) : (
          <>
            <Button asChild variant="link">
              <Link href={'/api/auth/signin'}>Sign in</Link>
            </Button>
            <Button asChild variant="link">
              <Link href={'/auth/signup'}>Sign up</Link>
            </Button>
          </>
        )}
      </div>
      <div className="w-full pt-10">
        <MarkdownEditor />
      </div>
    </main>
  )
}

export default Home
