import Link from 'next/link'
import {DateTime} from 'luxon'

import cardanoLogo from '@public/images/cardano-logo.png'
import {TableCell, TableRow} from '@/components/ui/Table'
import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import {Button} from '@/components/ui/Button'
import {formatAda, formatDate} from '@/lib/utils/common/format'
import {translateEnum} from '@/lib/utils/common/enums'
import {JudgeContest} from '@/server/actions/contest/getJudgeContests'
import {ContestOccurence} from '@/server/db/models'
import {PATHS} from '@/lib/utils/common/paths'

type JudgeContestsTableRowProps = {
  contest: JudgeContest
  contestOccurence: ContestOccurence
}

const JudgeContestsTableRow = ({
  contest,
  contestOccurence,
}: JudgeContestsTableRowProps) => {
  return (
    <TableRow className="bg-grey-90">
      <TableCell>
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarImage src={cardanoLogo.src} />
          </Avatar>
          <span className="text-titleS">{contest.title}</span>
        </div>
      </TableCell>
      {contestOccurence === ContestOccurence.FUTURE && (
        <TableCell className="text-bodyM">
          {formatDate(contest.createdAt, DateTime.DATETIME_MED)}
        </TableCell>
      )}
      <TableCell className="text-bodyM">
        {formatDate(contest.startDate, DateTime.DATETIME_MED)}
      </TableCell>
      <TableCell className="text-bodyM">
        {formatDate(contest.endDate, DateTime.DATETIME_MED)}
      </TableCell>
      <TableCell className="text-bodyM capitalize">
        {formatAda(contest.rewardsAmount)}
      </TableCell>
      {contestOccurence !== ContestOccurence.FUTURE && (
        <TableCell className="text-bodyM">
          {contest.pendingFindingsCount}
        </TableCell>
      )}
      {contestOccurence === ContestOccurence.PAST && (
        <>
          <TableCell className="text-bodyM">
            {contest.approvedFindingsCount}
          </TableCell>
          <TableCell className="text-bodyM">
            {contest.rejectedFindingsCount}
          </TableCell>
          <TableCell className="text-bodyM">
            {contest.rewardedAuditorsCount}
          </TableCell>
        </>
      )}
      <TableCell className="text-bodyM capitalize">
        {translateEnum.contestStatus(contest.status)}
      </TableCell>
      <TableCell className="text-right">
        <Button asChild variant="outline" size="small">
          <Link
            href={PATHS.judgeContestDetails(contest.id)}
            className="gap-2 text-buttonS">
            Details
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default JudgeContestsTableRow
