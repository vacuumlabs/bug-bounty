'use client'

import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {ArrowRight, LogOut} from 'lucide-react'

import {Button} from '@/components/ui/Button'
import bountyLabLogo from '@public/images/bounty-lab-icon.png'
import {cn} from '@/lib/utils/client/tailwind'
import {UserAvatar} from '@/components/ui/Avatar'

const ProjectsNavbar = () => {
  const pathname = usePathname()

  return (
    <div className="pointer-events-none fixed z-10 flex w-full flex-col bg-black px-24 py-6">
      <div className="pointer-events-auto flex flex-row items-center justify-between">
        <nav className="flex items-center gap-10">
          <Link href="/">
            <Image
              width={42}
              height={42}
              alt="Bounty Lab logo"
              src={bountyLabLogo}
            />
          </Link>
          <Button
            asChild
            variant="link"
            className={cn(pathname === '/my-projects' && 'font-bold')}>
            <Link href="/my-projects">Projects</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className={cn(pathname === '/my-projects/rewards' && 'font-bold')}>
            <Link href="/my-projects/rewards">Rewards</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-10">
          {pathname !== '/my-projects/new' && (
            <Button asChild>
              <Link href="/my-projects/new" className="gap-3">
                Create audit
                <ArrowRight />
              </Link>
            </Button>
          )}
          <UserAvatar />
          <Button asChild variant="link" className="font-bold">
            <Link href="/api/auth/signout">
              <LogOut />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectsNavbar
