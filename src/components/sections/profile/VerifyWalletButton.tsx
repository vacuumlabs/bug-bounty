'use client'

import {CardanoWallet, useWallet} from '@meshsdk/react'
import {useRouter} from 'next/navigation'

import {Button} from '@/components/ui/Button'
import {useAddWalletAddress} from '@/lib/queries/addWalletAddress'
import NoSSR from '@/components/helpers/NoSsr'

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
    <NoSSR>
      <CardanoWallet />
    </NoSSR>
  )
}

export default VerifyWalletButton
