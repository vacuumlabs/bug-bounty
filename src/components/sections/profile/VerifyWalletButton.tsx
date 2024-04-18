'use client'

import {useWallet} from '@meshsdk/react'
import {useRouter} from 'next/navigation'

import ConnectWallet from './ConnectWallet'

import {Button} from '@/components/ui/Button'
import {useAddWalletAddress} from '@/lib/queries/user/addWalletAddress'

const VerifyWalletButton = () => {
  const {connected} = useWallet()
  const {mutate} = useAddWalletAddress()
  const router = useRouter()

  const handleVerifyWallet = () =>
    mutate(undefined, {
      onSuccess: () => {
        router.push('/profile')
      },
    })

  return connected ? (
    <Button size="lg" onClick={handleVerifyWallet}>
      Verify wallet
    </Button>
  ) : (
    <ConnectWallet />
  )
}

export default VerifyWalletButton
