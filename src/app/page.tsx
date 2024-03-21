import Link from 'next/link'

import {getServerAuthSession} from '@/server/auth'

const Home = async () => {
  const session = await getServerAuthSession()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && (
            <span>Logged in as {session.user.name ?? session.user.email}</span>
          )}
        </p>
        <Link
          href={session ? '/api/auth/signout' : '/api/auth/signin'}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
          {session ? 'Sign out' : 'Sign in'}
        </Link>
      </div>
    </main>
  )
}

export default Home
