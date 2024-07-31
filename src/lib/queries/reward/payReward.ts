import {useMutation, useQueryClient} from '@tanstack/react-query'
import {BrowserWallet, Transaction} from '@meshsdk/core'
import {useWallet} from '@meshsdk/react'

import {requireConnectedWallet} from '../../utils/client/wallet'
import {queryKeys} from '../keys'

import {storeRewardTxHash} from '@/server/actions/reward/storeRewardTxHash'
import {getRewardPaymentDetails} from '@/server/actions/reward/getReward'
import {handleApiErrors} from '@/lib/utils/common/error'

const payReward = async (browserWallet: BrowserWallet, rewardId: string) => {
  const wallet = await requireConnectedWallet(browserWallet)

  const {
    amount,
    walletAddress: receiverAddress,
    transferTxHash,
  } = handleApiErrors(await getRewardPaymentDetails(rewardId))

  if (!receiverAddress) {
    throw new Error("The auditor hasn't added his wallet address yet.")
  }
  if (transferTxHash) {
    throw new Error('Reward already paid.')
  }

  const tx = new Transaction({initiator: wallet}).sendLovelace(
    {address: receiverAddress},
    amount,
  )
  const unsignedTx = await tx.build()
  const signedTx = await wallet.signTx(unsignedTx)
  const txHash = await wallet.submitTx(signedTx)

  const result = await storeRewardTxHash({rewardId, txHash})
  return handleApiErrors(result)
}

export const usePayReward = () => {
  const {wallet} = useWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rewardId: string) => payReward(wallet, rewardId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.rewards.toPayout._def,
      })
    },
  })
}
