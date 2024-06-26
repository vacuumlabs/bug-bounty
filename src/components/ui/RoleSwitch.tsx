'use client'

import Image from 'next/image'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import {useSession} from 'next-auth/react'

import hunterBadgeImage from '@public/images/hunter-badge.png'
import projectOwnerBadgeImage from '@public/images/project-owner-badge.png'
import {UserRole} from '@/server/db/models'
import {useSetUserRole} from '@/lib/queries/user/setUserRole'

const RoleSwitch = () => {
  const session = useSession()
  const {mutate, isPending} = useSetUserRole()

  if (!session.data?.user.role || session.data.user.role === UserRole.JUDGE) {
    return null
  }

  const isProjectOwner = session.data.user.role === UserRole.PROJECT_OWNER

  const onCheckedChange = () => {
    mutate(isProjectOwner ? UserRole.AUDITOR : UserRole.PROJECT_OWNER)
  }

  return (
    <SwitchPrimitives.Root
      className="peer inline-flex h-12 w-20 shrink-0 cursor-pointer items-center rounded-full bg-grey-90 p-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
      checked={isProjectOwner}
      onCheckedChange={onCheckedChange}
      disabled={isPending}>
      <SwitchPrimitives.Thumb className="pointer-events-none block h-9 w-9 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0">
        {isProjectOwner ? (
          <Image
            src={projectOwnerBadgeImage}
            height={36}
            width={36}
            alt="hunter badge"
          />
        ) : (
          <Image
            src={hunterBadgeImage}
            height={36}
            width={36}
            alt="hunter badge"
          />
        )}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  )
}

RoleSwitch.displayName = 'RoleSwitch'

export default RoleSwitch
