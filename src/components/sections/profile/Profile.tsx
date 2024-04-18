'use client'

import Link from 'next/link'

import SetUserAliasForm from './SetUserAliasForm'

import {Button} from '@/components/ui/Button'
import {useGetUser} from '@/lib/queries/user/getUser'

type WalletAddressProps = {
  address: string | null | undefined
}

const WalletAddress = ({address}: WalletAddressProps) =>
  address ? (
    <div>
      <span>{`Wallet address: ${address}`}</span>
      <Button asChild variant="link">
        <Link href="/profile/connect-wallet">Change</Link>
      </Button>
    </div>
  ) : (
    <Button asChild variant="link">
      <Link href="/profile/connect-wallet">Connect your wallet</Link>
    </Button>
  )

const Profile = () => {
  const {data: user} = useGetUser()

  return (
    <div className="flex flex-col items-start gap-4">
      <WalletAddress address={user?.walletAddress} />
      <SetUserAliasForm initialAlias={user?.alias} />
    </div>
  )
}

export default Profile
