'use client'

import {BrowserWallet} from '@meshsdk/core'
import {useWallet} from '@meshsdk/react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {getCsrfToken} from 'next-auth/react'

import {queryKeys} from '../keys'
import {requireConnectedWallet} from '../../utils/client/wallet'

import {verifyAndAddWalletAddress} from '@/server/actions/user/verifyAndAddWalletAddress'
import {formatWalletSignMessage} from '@/lib/utils/common/wallet'

const addWalletAddress = async (browserWallet: BrowserWallet) => {
  const wallet = await requireConnectedWallet(browserWallet)

  const nonce = await getCsrfToken()

  if (!nonce) {
    throw new Error('Missing CSRF token. Are you logged in?')
  }

  const rewardAddresses = await wallet.getRewardAddresses()
  const usedAddresses = await wallet.getUsedAddresses()
  const unusedAddresses = await wallet.getUnusedAddresses()
  const walletAddress = usedAddresses[0] ?? unusedAddresses[0]
  const rewardAddress = rewardAddresses[0]

  if (!walletAddress) {
    throw new Error('No wallet address')
  }
  if (!rewardAddress) {
    throw new Error('No reward address')
  }

  // verifying payment address signatures doesn't work for some reason, so we're signing with stake address instead
  // and on server we check, whether the stake address belongs to the payment address
  const signature = await wallet.signData(
    rewardAddress,
    formatWalletSignMessage(walletAddress, nonce),
  )

  return verifyAndAddWalletAddress(signature, walletAddress)
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
