import type {Metadata} from 'next'
import localFont from 'next/font/local'

import './globals.css'

import Providers from '@/components/global/Providers'
import {Toaster} from '@/components/ui/Toast'
import {getServerAuthSession} from '@/server/utils/auth'
import Navbar from '@/components/global/Navbar'
import {cn} from '@/lib/utils/client/tailwind'

const redditSans = localFont({
  src: '../fonts/RedditSans-VariableFont_wght.ttf',
})

export const metadata: Metadata = {
  title: 'Cardano Bug Bounty',
  description: 'Cardano Bug Bounty PoC',
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const session = await getServerAuthSession()

  return (
    <html lang="en">
      <body className={cn(redditSans.className, 'bg-black text-white')}>
        <Providers session={session}>
          <Navbar />
          <div className="flex min-h-screen flex-col pt-[136px]">
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
