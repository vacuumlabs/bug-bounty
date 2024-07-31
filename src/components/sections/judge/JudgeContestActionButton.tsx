import Link from 'next/link'

import {PATHS} from '@/lib/utils/common/paths'
import {JudgeContest} from '@/server/actions/contest/getJudgeContests'
import {ContestOccurence, ContestStatus} from '@/server/db/models'
import {Button} from '@/components/ui/Button'

type JudgeContestActionButtonProps = {
  contest: JudgeContest
  contestOccurence: ContestOccurence
}

const JudgeContestActionButton = ({
  contest,
  contestOccurence,
}: JudgeContestActionButtonProps) => {
  if (
    contestOccurence === ContestOccurence.FUTURE &&
    (contest.status === ContestStatus.PENDING ||
      contest.status === ContestStatus.IN_REVIEW)
  ) {
    return (
      <Button asChild variant="outline" size="small">
        <Link
          href={PATHS.judgeContestDetails(contest.id)}
          className="gap-2 text-buttonS">
          Review contest
        </Link>
      </Button>
    )
  }

  if (
    contestOccurence === ContestOccurence.PAST &&
    contest.status === ContestStatus.APPROVED
  ) {
    return (
      <Button asChild variant="outline" size="small">
        <Link
          href={PATHS.judgeContestFindings(contest.id)}
          className="gap-2 text-buttonS">
          Judge findings
        </Link>
      </Button>
    )
  }

  if (
    contestOccurence === ContestOccurence.PAST &&
    contest.status === ContestStatus.FINISHED &&
    contest.rewardsToPay > 0
  ) {
    return (
      <Button asChild variant="outline" size="small">
        <Link href="#" className="gap-2 text-buttonS">
          Payout Rewards
        </Link>
      </Button>
    )
  }
}

export default JudgeContestActionButton
