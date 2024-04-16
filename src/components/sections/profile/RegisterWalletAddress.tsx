'use client'

import VerifyWalletButton from './VerifyWalletButton'

import {useGetUser} from '@/lib/queries/getUser'

const RegisterWalletAddress = () => {
  const {data: user} = useGetUser()

  if (!user) {
    return null
  }

  return user.walletAddress ? (
    <>
      <h1 className="text-2xl">Wallet connected</h1>
      <span>{`Wallet address: ${user.walletAddress}`}</span>
      <span className="mt-8 text-lg">Change connected wallet:</span>
      <VerifyWalletButton />
    </>
  ) : (
    <>
      <h1 className="text-2xl">
        Connect your wallet to add it to your account
      </h1>
      <VerifyWalletButton />
    </>
  )
}

export default RegisterWalletAddress
