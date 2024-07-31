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

  return (
    <TableRow>
      <TableCell className="text-titleS">
        {reward.user?.name ?? reward.user?.alias ?? '-'}
      </TableCell>
      <TableCell className="text-bodyM">{reward.user?.email ?? '-'}</TableCell>
      <TableCell className="text-bodyM">
        {reward.user?.walletAddress ?? '-'}
      </TableCell>
      <TableCell className="text-bodyM">{formatAda(reward.amount)}</TableCell>
      <TableCell>
        {reward.payoutDate ? formatDate(reward.payoutDate) : '-'}
      </TableCell>
      <TableCell>
        {reward.transferTxHash ? (
          <Button asChild variant="link" size="small">
            <Link
              href={`https://cardanoscan.io/transaction/${reward.transferTxHash}`}>
              {formatTxHash(reward.transferTxHash)}
            </Link>
          </Button>
        ) : (
          <span className="text-bodyM">
            {formatTxHash(reward.transferTxHash)}
          </span>
        )}
      </TableCell>
      {!reward.transferTxHash && (
        <TableCell>
          <Button
            size="small"
            onClick={() => mutate(reward.id)}
            disabled={isPending}>
            Pay reward
          </Button>
        </TableCell>
      )}
    </TableRow>
  )
}

export default JudgeRewardsPayoutTableRow
