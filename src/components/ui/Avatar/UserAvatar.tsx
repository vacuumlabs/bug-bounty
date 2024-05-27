'use client'

import {useSession} from 'next-auth/react'
import Link from 'next/link'

import {Avatar, AvatarFallback, AvatarImage} from './Avatar'

import {PATHS} from '@/lib/utils/common/paths'

const UserAvatar = () => {
  const session = useSession()

  return (
    <Link href={PATHS.profile}>
      <Avatar>
        <AvatarImage src={session.data?.user.image ?? undefined} />
        <AvatarFallback>{session.data?.user.name?.[0]}</AvatarFallback>
      </Avatar>
    </Link>
  )
}

export default UserAvatar
