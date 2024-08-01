import Link from 'next/link'
import {Clipboard} from 'lucide-react'

import {Button} from '@/components/ui/Button'
import {TableCell, TableRow} from '@/components/ui/Table'
import {usePayReward} from '@/lib/queries/reward/payReward'
import {
  formatAda,
  formatAddress,
  formatDate,
  formatTxHash,
} from '@/lib/utils/common/format'
import {RewardsPayout} from '@/server/actions/reward/getReward'
import {toast} from '@/components/ui/Toast'

type JudgeRewardsPayoutTableRowProps = {
  reward: RewardsPayout
}

const JudgeRewardsPayoutTableRow = ({
  reward,
}: JudgeRewardsPayoutTableRowProps) => {
  const {mutate, isPending} = usePayReward()

  const payReward = () => {
    if (!reward.rewardDetails[0]?.contest.id || !reward.userDetails[0]?.id)
      return

    mutate({
      contestId: reward.rewardDetails[0]?.contest.id,
      userId: reward.userDetails[0]?.id,
    })
  }

  const copyWalletAddress = async () => {
    if (!reward.rewardWalletAddress) return
    await navigator.clipboard.writeText(reward.rewardWalletAddress)
    toast({
      title: 'Copied to Clipboard',
      description: `Wallet address ${formatAddress(reward.rewardWalletAddress)} copied to clipboard`,
    })
  }

  return (
    <TableRow>
      <TableCell className="text-titleS">
        {reward.userDetails[0]?.name ?? reward.userDetails[0]?.alias ?? '-'}
      </TableCell>
      <TableCell className="text-bodyM">
        {reward.userDetails[0]?.email ?? '-'}
      </TableCell>
      <TableCell className="text-bodyM">
        <div className="flex items-center gap-2">
          {formatAddress(reward.rewardWalletAddress)}
          <Button variant="ghost" onClick={copyWalletAddress}>
            <Clipboard width={16} height={16} />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-bodyM">
        {reward.totalAmount ? formatAda(reward.totalAmount) : '-'}
      </TableCell>
      <TableCell>
        {reward.rewardDetails[0]?.payoutDate
          ? formatDate(reward.rewardDetails[0].payoutDate)
          : '-'}
      </TableCell>
      <TableCell>
        {reward.rewardDetails[0]?.transferTxHash ? (
          <Button asChild variant="link" size="small">
            <Link
              href={`https://cardanoscan.io/transaction/${reward.rewardDetails[0].transferTxHash}`}>
              {formatTxHash(reward.rewardDetails[0]?.transferTxHash)}
            </Link>
          </Button>
        ) : (
          <span className="text-bodyM">
            {formatTxHash(reward.rewardDetails[0]?.transferTxHash)}
          </span>
        )}
      </TableCell>
      {!reward.rewardDetails[0]?.transferTxHash && (
        <TableCell>
          <Button size="small" disabled={isPending} onClick={payReward}>
            Pay reward
          </Button>
        </TableCell>
      )}
    </TableRow>
  )
}

export default JudgeRewardsPayoutTableRow
