'use client'

import {useWallet} from '@meshsdk/react'
import {useRouter, useSearchParams} from 'next/navigation'

import ConnectWallet from './ConnectWallet'

import {Button} from '@/components/ui/Button'
import {useAddWalletAddress} from '@/lib/queries/user/addWalletAddress'
import {PATHS} from '@/lib/utils/common/paths'

const VerifyWalletButton = () => {
  const {connected} = useWallet()
  const {mutate} = useAddWalletAddress()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleVerifyWallet = () =>
    mutate(undefined, {
      onSuccess: () => {
        router.push(
          searchParams.get('source') === 'confirmPath'
            ? PATHS.myProjects
            : PATHS.profile,
        )
      },
    })

  return connected ? (
    <Button onClick={handleVerifyWallet}>Verify wallet</Button>
  ) : (
    <ConnectWallet />
  )
}

export default VerifyWalletButton
