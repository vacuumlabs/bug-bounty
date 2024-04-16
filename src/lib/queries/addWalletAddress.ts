'use client'

import {BrowserWallet} from '@meshsdk/core'
import {useWallet} from '@meshsdk/react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {getCsrfToken} from 'next-auth/react'

import {queryKeys} from './keys'

import {verifyAndAddWalletAddress} from '@/server/actions/verifyAndAddWalletAddress'
import {formatWalletSignMessage} from '@/lib/utils/common/wallet'

const addWalletAddress = async (wallet: BrowserWallet) => {
  const nonce = await getCsrfToken()

  if (!nonce) {
    throw new Error('Missing CSRF token. Are you logged in?')
  }

  const addresses = await wallet.getRewardAddresses()
  const walletAddress = addresses[0]

  if (!walletAddress) {
    throw new Error('No wallet address')
  }

  const signature = await wallet.signData(
    walletAddress,
    formatWalletSignMessage(walletAddress, nonce),
  )

  await verifyAndAddWalletAddress(signature, walletAddress)
}

export const useAddWalletAddress = () => {
  const {wallet} = useWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => addWalletAddress(wallet),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail._def,
      })
    },
  })
}
