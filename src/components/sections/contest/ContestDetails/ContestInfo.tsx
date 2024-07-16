'use client'

import Link from 'next/link'
import {LinkIcon} from 'lucide-react'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/navigation'

import {Contest} from '@/server/actions/contest/getContest'
import ContestSeverityWeightsDisplay from '@/components/ui/ContestSeverityWeightsDisplay'
import {formatAda} from '@/lib/utils/common/format'
import {Button} from '@/components/ui/Button'
import {ContestStatus, UserRole} from '@/server/db/models'
import {useApproveOrRejectContest} from '@/lib/queries/contest/editContest'
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

type ContestInfoProps = {
  contest: Contest
  showRewardsAmount?: boolean
}

const ContestInfo = ({
  contest,
  showRewardsAmount = false,
}: ContestInfoProps) => {
  const {data: session} = useSession()
  const router = useRouter()

  const {mutate} = useApproveOrRejectContest()

  return (
    <div className="mt-12 xl:mx-[340px]">
      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">
          Links to the Github repository
        </h3>
        <Link href={contest.repoUrl} className="flex gap-3">
          <span>GitHub Repository</span>
          <LinkIcon width={24} height={24} />
        </Link>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Scope definition</h3>
        {contest.filesInScope.map((fileUrl) => (
          <Link href={contest.repoUrl} key={fileUrl} className="flex gap-3">
            <span>{fileUrl}</span>
            <LinkIcon width={24} height={24} />
          </Link>
        ))}
      </div>

      {showRewardsAmount && (
        <div className="mb-12 flex flex-col gap-3">
          <h3 className="text-bodyL text-purple-light">
            Total rewards (in ADA)
          </h3>
          <p className="text-bodyM">
            {formatAda(contest.rewardsAmount, 2, false)}
          </p>
        </div>
      )}

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Description</h3>
        <p className="text-bodyM">{contest.description}</p>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Severity Rewards</h3>
        <ContestSeverityWeightsDisplay
          info={contest.contestSeverityWeights?.info}
          low={contest.contestSeverityWeights?.low}
          medium={contest.contestSeverityWeights?.medium}
          high={contest.contestSeverityWeights?.high}
          critical={contest.contestSeverityWeights?.critical}
        />
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Custom conditions</h3>
        <p className="text-bodyM">{contest.customConditions || '-'}</p>
      </div>

      {session?.user.role === UserRole.JUDGE &&
        contest.status === ContestStatus.IN_REVIEW && (
          <div className="flex gap-8">
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
                  <AlertDialogAction
                    onClick={() =>
                      mutate(
                        {
                          contestId: contest.id,
                          newStatus: ContestStatus.APPROVED,
                        },
                        {
                          onSuccess: () => router.push(PATHS.judgeContests),
                        },
                      )
                    }>
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
                  <AlertDialogAction
                    onClick={() =>
                      mutate(
                        {
                          contestId: contest.id,
                          newStatus: ContestStatus.REJECTED,
                        },
                        {
                          onSuccess: () => router.push(PATHS.judgeContests),
                        },
                      )
                    }>
                    Yes, reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
    </div>
  )
}

export default ContestInfo
