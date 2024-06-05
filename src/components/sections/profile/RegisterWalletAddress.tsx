'use client'

import VerifyWalletButton from './VerifyWalletButton'

import {useGetUser} from '@/lib/queries/user/getUser'

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
      <h1 className="text-3xl font-semibold">CONNECT YOUR WALLET</h1>
      <p className="text-center text-lg">
        Make sure to select the address you wish to use for rewards, as a single
        wallet can contain multiple addresses or accounts.
      </p>
      <VerifyWalletButton />
    </>
  )
}

export default RegisterWalletAddress
