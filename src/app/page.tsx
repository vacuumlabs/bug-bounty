import Link from 'next/link'

import {getServerAuthSession} from '@/server/auth'
import {Button} from '@/components/ui/Button'
import MarkdownEditor from '@/components/markdown/MarkdownEditor'

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
        <Button asChild variant="link">
          <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
            {session ? 'Sign out' : 'Sign in'}
          </Link>
        </Button>
        {!session && (
          <Button asChild variant="link">
            <Link href={'/auth/signup'}>Sign up</Link>
          </Button>
        )}
      </div>
      <div className="w-full pt-10">
        <MarkdownEditor />
      </div>
    </main>
  )
}

export default Home
