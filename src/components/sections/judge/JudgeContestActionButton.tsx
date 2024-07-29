import {useState} from 'react'
import Link from 'next/link'

import {PATHS} from '@/lib/utils/common/paths'
import {JudgeContest} from '@/server/actions/contest/getJudgeContests'
import {ContestOccurence, ContestStatus} from '@/server/db/models'
import {Button} from '@/components/ui/Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/AlertDialog'
import {useFinalizeRewards} from '@/lib/queries/reward/finalizeRewards'
import {toast} from '@/components/ui/Toast'

type JudgeContestActionButtonProps = {
  contest: JudgeContest
  contestOccurence: ContestOccurence
}

const JudgeContestActionButton = ({
  contest,
  contestOccurence,
}: JudgeContestActionButtonProps) => {
  const [openFinalizeRewards, setOpenFinalizeRewards] = useState(false)
  const {mutate: finalizeRewardsMutate} = useFinalizeRewards()

  const finalizeRewards = () => {
    finalizeRewardsMutate(contest.id, {
      onSuccess: () => {
        setOpenFinalizeRewards(false)
        toast({
          title: 'Success',
          description: 'Contest rewards has been finalized.',
        })
      },
    })
  }

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
    contest.status === ContestStatus.APPROVED &&
    contest.pendingFindingsCount > 0
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
    contest.pendingFindingsCount === 0 &&
    contestOccurence === ContestOccurence.PAST &&
    contest.status === ContestStatus.APPROVED
  ) {
    return (
      <AlertDialog
        open={openFinalizeRewards}
        onOpenChange={setOpenFinalizeRewards}>
        <AlertDialogTrigger>
          <Button variant="outline" size="small">
            <span className="uppercase">Finalize Rewards</span>
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="uppercase">
              Are you sure you want to finalize the rewards for this contest?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="sr-only">
            Calculate and finalize rewards. This will also mark the contest as
            finished.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={finalizeRewards}>
              Yes, finalize
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
