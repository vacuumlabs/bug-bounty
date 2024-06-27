'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useSession} from 'next-auth/react'
import {usePathname} from 'next/navigation'
import {LogOut} from 'lucide-react'

import {Button} from '../../ui/Button'

import bountyLabLogo from '@public/images/bounty-lab-logo.png'
import {UserAvatar} from '@/components/ui/Avatar'
import {cn} from '@/lib/utils/client/tailwind'
import {useSearchParamsState} from '@/lib/hooks/useSearchParamsState'
import {HomePageTab} from '@/lib/types/enums'
import {
  PATHS,
  getAboutUsPathByUserRoleAndHomePageTab,
  getDashboardPathByUserRole,
} from '@/lib/utils/common/paths'
import SignOutButton from '@/components/ui/SignOutButon'
import RoleSwitch from '@/components/ui/RoleSwitch'

const Navbar = () => {
  const [currentTab] = useSearchParamsState('tab')
  const pathname = usePathname()
  const session = useSession()
  const role = session.data?.user.role

  const isProjectsTabActive = currentTab === HomePageTab.PROJECTS
  const isLoggedIn = session.status === 'authenticated'

  return (
    <div className="pointer-events-none fixed z-10 flex h-[289px] w-full flex-col bg-gradient-to-b from-black px-24 pt-10">
      <div className="pointer-events-auto flex flex-row items-center justify-between">
        <Link href={PATHS.home}>
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
            className={cn(pathname === PATHS.home && 'font-bold')}>
            <Link href={PATHS.home}>Home</Link>
          </Button>
          <Button
            asChild
            variant="link"
            className={cn(
              pathname ===
                getAboutUsPathByUserRoleAndHomePageTab(role, currentTab) &&
                'font-bold',
            )}>
            <Link
              href={getAboutUsPathByUserRoleAndHomePageTab(role, currentTab)}>
              About us
            </Link>
          </Button>
          {isLoggedIn ? (
            <>
              <Button
                asChild
                variant="link"
                className={cn(
                  pathname === getDashboardPathByUserRole(role) && 'font-bold',
                )}>
                <Link href={getDashboardPathByUserRole(role)}>Dashboard</Link>
              </Button>
              <UserAvatar />
              <RoleSwitch />
              <SignOutButton variant="link">
                <LogOut />
              </SignOutButton>
            </>
          ) : (
            <Button asChild variant="link">
              <Link href={PATHS.signIn}>Login</Link>
            </Button>
          )}
          <Button asChild>
            {isProjectsTabActive ? (
              <Link href={PATHS.newProject}>Get protected</Link>
            ) : (
              <Link href="/#contests">Explore bounties</Link>
            )}
          </Button>
        </nav>
      </div>
    </div>
  )
}

export default Navbar
