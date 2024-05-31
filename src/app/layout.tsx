import type {Metadata} from 'next'
import localFont from 'next/font/local'
import {ReactNode} from 'react'

import './globals.css'

import Providers from '@/components/global/Providers'
import {Toaster} from '@/components/ui/Toast'
import {getServerAuthSession} from '@/server/utils/auth'
import {cn} from '@/lib/utils/client/tailwind'
import Footer from '@/components/global/Footer'

const redditSans = localFont({
  src: '../fonts/RedditSans-VariableFont_wght.ttf',
})

export const metadata: Metadata = {
  title: 'Bounty Lab',
  description: 'Cardano Bug Bounty PoC',
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const session = await getServerAuthSession()

  return (
    <html lang="en">
      <body className={cn(redditSans.className, 'bg-black text-white')}>
        <Providers session={session}>
          <div className="flex min-h-screen flex-col">
            <div className="flex flex-grow flex-col">{children}</div>
            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
