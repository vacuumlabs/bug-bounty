import {DateTime} from 'luxon'
import {Wallet} from 'lucide-react'

import MyFindingsSeverityBadge from '../MyFindingsSeverityBadge'

import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import {TableCell, TableRow} from '@/components/ui/Table'
import cardanoLogo from '@public/images/cardano-logo.png'
import {formatAda, formatDate} from '@/lib/utils/common/format'
import {Button} from '@/components/ui/Button'
import {MyFindingsReward} from '@/server/actions/reward/getMyFindingsRewards'

type MyFindingsRewardsTableRowProps = {
  data: MyFindingsReward
}

const MyFindingsRewardsTableRow = ({data}: MyFindingsRewardsTableRowProps) => {
  const contestTitle = data.contest?.title
  const submitted = data.finding?.createdAt
  const reviewed = data.finding?.updatedAt
  const severity = data.finding?.severity
  const txHash = data.reward.transferTxHash

  return (
    <TableRow className="bg-grey-90">
      <TableCell>
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarImage src={cardanoLogo.src} />
          </Avatar>
          <span className="text-titleS">{contestTitle ?? '-'}</span>
        </div>
      </TableCell>
      <TableCell className="text-bodyM">
        {submitted ? formatDate(submitted, DateTime.DATETIME_MED) : '-'}
      </TableCell>
      <TableCell className="text-bodyM">
        {reviewed ? formatDate(reviewed, DateTime.DATETIME_MED) : '-'}
      </TableCell>
      <TableCell className="text-bodyM">
        {severity ? <MyFindingsSeverityBadge severity={severity} /> : '-'}
      </TableCell>
      <TableCell className="text-bodyM capitalize">
        {formatAda(data.reward.amount)}
      </TableCell>
      <TableCell className="text-bodyM capitalize">
        {txHash ? 'Paid' : 'In process'}
      </TableCell>

      <TableCell className="text-right">
        {!!txHash && (
          <Button asChild variant="outline" size="small">
            <a
              href={`https://cardanoscan.io/transaction/${txHash}`}
              target="_blank"
              className="gap-2 text-buttonS uppercase">
              TX detail
              <Wallet width={16} height={16} />
            </a>
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default MyFindingsRewardsTableRow
