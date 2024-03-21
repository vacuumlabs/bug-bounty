'use client'

import {BrowserWallet} from '@meshsdk/core'
import {useWallet} from '@meshsdk/react'
import {useMutation} from '@tanstack/react-query'
import {getCsrfToken} from 'next-auth/react'
import {useRouter} from 'next/navigation'

import {formatWalletSignMessage} from '../utils/auth'

import {verifyAndAddWalletAddress} from '@/server/actions/verifyAndAddWalletAddress'

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
  const router = useRouter()

  return useMutation({
    mutationFn: () => addWalletAddress(wallet),
    onSuccess: () => router.replace('/'),
  })
}
