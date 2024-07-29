import Link from 'next/link'
import {DateTime} from 'luxon'

import JudgeContestActionButton from './JudgeContestActionButton'

import cardanoLogo from '@public/images/cardano-logo.png'
import {TableCell, TableRow} from '@/components/ui/Table'
import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import {formatAda, formatDate, formatTxHash} from '@/lib/utils/common/format'
import {translateEnum} from '@/lib/utils/common/enums'
import {JudgeContest} from '@/server/actions/contest/getJudgeContests'
import {ContestOccurence} from '@/server/db/models'
import {PATHS} from '@/lib/utils/common/paths'
import {Button} from '@/components/ui/Button'

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

          <Link
            href={PATHS.judgeContestDetails(contest.id)}
            className="gap-2 underline">
            <span className="text-titleS">{contest.title}</span>
          </Link>
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
          <Button asChild variant="link">
            <Link
              href={`${PATHS.judgeContestFindings(contest.id)}?type=PENDING`}>
              {contest.pendingFindingsCount}
            </Link>
          </Button>
        </TableCell>
      )}
      {contestOccurence === ContestOccurence.PAST && (
        <>
          <TableCell className="text-bodyM">
            <Button asChild variant="link">
              <Link
                href={`${PATHS.judgeContestFindings(contest.id)}?type=APPROVED`}>
                {contest.approvedFindingsCount}
              </Link>
            </Button>
          </TableCell>
          <TableCell className="text-bodyM">
            <Button asChild variant="link">
              <Link
                href={`${PATHS.judgeContestFindings(contest.id)}?type=REJECTED`}>
                {contest.rejectedFindingsCount}
              </Link>
            </Button>
          </TableCell>
          <TableCell className="text-bodyM">
            {contest.rewardedAuditorsCount}
          </TableCell>
        </>
      )}
      {contestOccurence === ContestOccurence.FUTURE && (
        <TableCell className="text-bodyM">
          {formatTxHash(contest.rewardsTransferTxHash)}
        </TableCell>
      )}
      <TableCell className="text-bodyM capitalize">
        {translateEnum.contestStatus(contest.status)}
      </TableCell>
      <TableCell className="text-right">
        <JudgeContestActionButton
          contest={contest}
          contestOccurence={contestOccurence}
        />
      </TableCell>
    </TableRow>
  )
}

export default JudgeContestsTableRow
