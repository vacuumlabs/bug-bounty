'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useSession} from 'next-auth/react'
import {usePathname} from 'next/navigation'

import {Button} from '../../ui/Button'

import bountyLabLogo from '@public/images/bounty-lab-logo.png'
import {UserAvatar} from '@/components/ui/Avatar'
import {cn} from '@/lib/utils/client/tailwind'

const Navbar = () => {
  const pathname = usePathname()
  const session = useSession()

  return (
    <div className="pointer-events-none fixed z-10 flex h-[289px] w-full flex-col bg-gradient-to-b from-black px-24 pt-11">
      <div className="pointer-events-auto flex flex-row items-center justify-between">
        <Link href="/">
          <Image
            width={206}
            height={42}
            alt="Bounty Lab logo"
            src={bountyLabLogo}
          />
        </Link>
        <nav className="flex items-center gap-10">
          <Button
            asChild
            variant="link"
            className={cn(pathname === '/' && 'font-bold')}>
            <Link href="/">Home</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className={cn(pathname === '/about-us' && 'font-bold')}>
            <Link href="/about-us">About us</Link>
          </Button>
          {session.status === 'authenticated' ? (
            <UserAvatar />
          ) : (
            <Button asChild variant="link" className="font-bold">
              <Link href="/api/auth/signin">Login</Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/contests">Explore bounties</Link>
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
