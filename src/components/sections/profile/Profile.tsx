'use client'

import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {useGetUser} from '@/lib/queries/user/getUser'

const Profile = () => {
  const {data: user} = useGetUser()

  return user?.walletAddress ? (
    <div>
      <span>{`Wallet address: ${user.walletAddress}`}</span>
      <Button asChild variant="link">
        <Link href="/profile/connect-wallet">Change</Link>
      </Button>
    </div>
  ) : (
    <Button asChild variant="link">
      <Link href="/profile/connect-wallet">Connect your wallet</Link>
    </Button>
  )
}

export default Profile
