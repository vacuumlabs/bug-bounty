import Link from 'next/link'
import {Wallet} from 'lucide-react'
import {DateTime} from 'luxon'

import cardanoLogo from '@public/images/cardano-logo.png'
import {TableCell, TableRow} from '@/components/ui/Table'
import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import {Button} from '@/components/ui/Button'
import {formatAda, formatDate, formatTxHash} from '@/lib/utils/common/format'
import {JudgeReward} from '@/server/actions/reward/getJudgeRewards'
import {PATHS} from '@/lib/utils/common/paths'

type JudgeRewardsTableRowProps = {
  rewardContest: JudgeReward
}

const JudgeRewardsTableRow = ({rewardContest}: JudgeRewardsTableRowProps) => {
  const rewardsAmount = rewardContest.distributedRewardsAmount
    ? formatAda(rewardContest.distributedRewardsAmount)
    : '-'
  const txHash = rewardContest.rewardsTransferTxHash

  return (
    <TableRow className="bg-grey-90">
      <TableCell>
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarImage src={cardanoLogo.src} />
          </Avatar>
          <Link
            href={PATHS.judgeContestDetails(rewardContest.id)}
            className="text-titleS">
            {rewardContest.title}
          </Link>
        </div>
      </TableCell>

      <TableCell className="text-bodyM">
        {formatDate(rewardContest.endDate, DateTime.DATETIME_MED)}
      </TableCell>

      <TableCell className="text-bodyM capitalize">{rewardsAmount}</TableCell>

      <TableCell className="text-bodyM capitalize">
        <Button asChild variant="outline" size="small">
          <Link
            href={`https://cardanoscan.io/transaction/${txHash}`}
            target="_blank"
            className="gap-2 text-buttonS">
            {formatTxHash(txHash)}
            <Wallet width={16} height={16} />
          </Link>
        </Button>
      </TableCell>

      <TableCell className="text-right">
        <Button asChild variant="outline" size="small">
          <Link
            href={PATHS.judgeRewardsPayout(rewardContest.id)}
            className="gap-2 text-buttonS">
            Payout rewards
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default JudgeRewardsTableRow
