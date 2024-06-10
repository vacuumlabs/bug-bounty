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
      <h1 className="text-titleL uppercase">Connect your wallet</h1>
      <p className="mt-3 text-center">
        Make sure to select the address you wish to use for rewards, as a single
        wallet can contain multiple addresses or accounts.
      </p>
      <div className="mt-12">
        <VerifyWalletButton />
      </div>
    </>
  )
}

export default RegisterWalletAddress
