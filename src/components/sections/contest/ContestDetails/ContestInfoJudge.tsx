import {useSession} from 'next-auth/react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'

import {Button} from '@/components/ui/Button'
import {ContestStatus, UserRole} from '@/server/db/models'
import {useReviewContest} from '@/lib/queries/contest/editContest'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog'
import {PATHS} from '@/lib/utils/common/paths'
import {Contest} from '@/server/actions/contest/getContest'

type ContestInfoJudgeProps = {
  contest: Contest
}

const ContestInfoJudge = ({contest}: ContestInfoJudgeProps) => {
  const {data: session} = useSession()

  const router = useRouter()

  const {mutate: reviewContestMutate} = useReviewContest()

  if (session?.user.role !== UserRole.JUDGE) {
    return null
  }

  const approveContest = () => {
    reviewContestMutate(
      {
        contestId: contest.id,
        newStatus: ContestStatus.APPROVED,
      },
      {
        onSuccess: () => router.push(PATHS.judgeContests),
      },
    )
  }

  const rejectContest = () => {
    reviewContestMutate(
      {
        contestId: contest.id,
        newStatus: ContestStatus.REJECTED,
      },
      {
        onSuccess: () => router.push(PATHS.judgeContests),
      },
    )
  }

  const markContestAsPending = () => {
    reviewContestMutate(
      {
        contestId: contest.id,
        newStatus: ContestStatus.PENDING,
      },
      {
        onSuccess: () => router.push(PATHS.judgeContests),
      },
    )
  }

  return (
    <>
      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">
          Rewards Transfer TX Hash
        </h3>
        {contest.rewardsTransferTxHash ? (
          <Link
            href={`https://cardanoscan.io/transaction/${contest.rewardsTransferTxHash}`}
            className="text-bodyM">
            {contest.rewardsTransferTxHash}
          </Link>
        ) : (
          <p className="text-bodyM">-</p>
        )}
      </div>

      {(contest.status === ContestStatus.IN_REVIEW ||
        contest.status === ContestStatus.PENDING) && (
        <div className="flex gap-8">
          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="flex gap-3">
                <span className="uppercase">Mark as pending</span>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="uppercase">
                  Are you sure you want to mark this contest as pending?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={markContestAsPending}>
                  Yes, mark as pending
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="flex gap-3">
                <span className="uppercase">Approve contest</span>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="uppercase">
                  Are you sure you want to approve this contest?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={approveContest}>
                  Yes, approve
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger>
              <Button variant="outline" className="flex gap-3">
                <span className="uppercase">Reject contest</span>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="uppercase">
                  Are you sure you want to reject this contest?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={rejectContest}>
                  Yes, reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  )
}

export default ContestInfoJudge
