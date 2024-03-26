'use client'

import {CardanoWallet, useWallet} from '@meshsdk/react'

import {Button} from '@/components/ui/Button'
import {useAddWalletAddress} from '@/lib/queries/addWalletAddress'
import NoSSR from '@/components/ui/NoSsr'

const VerifyWalletButton = () => {
  const {connected} = useWallet()
  const {mutate} = useAddWalletAddress()

  return connected ? (
    <Button size="lg" onClick={() => mutate()}>
      Verify wallet
    </Button>
  ) : (
    <NoSSR>
      <CardanoWallet />
    </NoSSR>
  )
}

export default VerifyWalletButton
