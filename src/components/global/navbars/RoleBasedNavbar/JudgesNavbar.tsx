'use client'

import Link from 'next/link'
import Image from 'next/image'
import {usePathname} from 'next/navigation'
import {LogOut} from 'lucide-react'

import {Button} from '@/components/ui/Button'
import bountyLabLogo from '@public/images/bounty-lab-icon.png'
import {cn} from '@/lib/utils/client/tailwind'
import {UserAvatar} from '@/components/ui/Avatar'
import {PATHS} from '@/lib/utils/common/paths'
import SignOutButton from '@/components/ui/SignOutButon'
import RoleSwitch from '@/components/ui/RoleSwitch'

const JudgesNavbar = () => {
  const pathname = usePathname()

  return (
    <div className="pointer-events-none fixed z-10 flex w-full flex-col bg-black px-24 py-6">
      <div className="pointer-events-auto flex flex-row items-center justify-between">
        <nav className="flex items-center gap-10">
          <Link href={PATHS.home}>
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
            className={cn(pathname === PATHS.judgeContests && 'font-bold')}>
            <Link href={PATHS.judgeContests}>Contests</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className={cn(pathname === PATHS.judgeRewards && 'font-bold')}>
            <Link href={PATHS.judgeRewards}>Rewards</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-10">
          <UserAvatar />
          <RoleSwitch />
          <SignOutButton variant="link">
            <LogOut />
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}

export default JudgesNavbar
