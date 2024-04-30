import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import Link from 'next/link'

import './globals.css'

import Providers from '@/components/global/Providers'
import {Toaster} from '@/components/ui/Toast'
import {getServerAuthSession} from '@/server/utils/auth'
import ConnectWallet from '@/components/sections/profile/ConnectWallet'

const inter = Inter({subsets: ['latin']})

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
      <body className={inter.className}>
        <Providers session={session}>
          <nav className="fixed flex h-[90px] w-full items-center justify-between bg-slate-200 p-4 px-6">
            <Link className="text-3xl font-semibold text-black" href="/">
              Cardano Bug Bounty PoC
            </Link>
            <ConnectWallet />
          </nav>
          <div className="flex flex-col pt-[90px]">{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
