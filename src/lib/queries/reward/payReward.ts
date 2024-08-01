import {useMutation, useQueryClient} from '@tanstack/react-query'
import {BrowserWallet, Transaction} from '@meshsdk/core'
import {useWallet} from '@meshsdk/react'

import {requireConnectedWallet} from '../../utils/client/wallet'
import {queryKeys} from '../keys'

import {storeRewardTxHash} from '@/server/actions/reward/storeRewardTxHash'
import {getRewardPaymentDetails} from '@/server/actions/reward/getReward'
import {handleApiErrors} from '@/lib/utils/common/error'

const payReward = async (
  browserWallet: BrowserWallet,
  contestId: string,
  userId: string,
) => {
  const wallet = await requireConnectedWallet(browserWallet)
  const {amount, walletAddress: receiverAddress} = handleApiErrors(
    await getRewardPaymentDetails(contestId, userId),
  )

  console.log('receiverAddress', receiverAddress, 'amount', amount)

  if (!receiverAddress) {
    throw new Error("The auditor hasn't added his wallet address yet.")
  }

  const tx = new Transaction({initiator: wallet}).sendLovelace(
    {address: receiverAddress},
    amount,
  )
  const unsignedTx = await tx.build()
  const signedTx = await wallet.signTx(unsignedTx)
  const txHash = await wallet.submitTx(signedTx)

  const result = await storeRewardTxHash({contestId, userId, txHash})
  return handleApiErrors(result)
}

export const usePayReward = () => {
  const {wallet} = useWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({contestId, userId}: {contestId: string; userId: string}) =>
      payReward(wallet, contestId, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.rewards._def,
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.findings._def,
      })
    },
  })
}
