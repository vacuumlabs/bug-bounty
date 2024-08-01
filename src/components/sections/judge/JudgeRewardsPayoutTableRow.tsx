import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {TableCell, TableRow} from '@/components/ui/Table'
import {usePayReward} from '@/lib/queries/reward/payReward'
import {formatAda, formatDate, formatTxHash} from '@/lib/utils/common/format'
import {RewardsPayout} from '@/server/actions/reward/getReward'

type JudgeRewardsPayoutTableRowProps = {
  reward: RewardsPayout
}

const JudgeRewardsPayoutTableRow = ({
  reward,
}: JudgeRewardsPayoutTableRowProps) => {
  const {mutate, isPending} = usePayReward()

  const payReward = () => {
    if (!reward.rewardDetails[0]?.contest.id || !reward.user?.id) return

    mutate({
      contestId: reward.rewardDetails[0]?.contest.id,
      userId: reward.user.id,
    })
  }

  return (
    <TableRow>
      <TableCell className="text-titleS">
        {reward.user?.name ?? reward.user?.alias ?? '-'}
      </TableCell>
      <TableCell className="text-bodyM">{reward.user?.email ?? '-'}</TableCell>
      <TableCell className="text-bodyM">
        {reward.user?.walletAddress ?? '-'}
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
