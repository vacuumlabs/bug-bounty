'use client'

import {CardanoWallet, useWallet} from '@meshsdk/react'

import {Button} from '@/components/ui/Button'
import {useAddWalletAddress} from '@/lib/queries/addWalletAddress'

const VerifyWalletButton = () => {
  const {connected} = useWallet()
  const {mutate} = useAddWalletAddress()

  return connected ? (
    <Button size="lg" onClick={() => mutate()}>
      Verify wallet
    </Button>
  ) : (
    <CardanoWallet />
  )
}

export default VerifyWalletButton
