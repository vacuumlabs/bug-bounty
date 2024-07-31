import {useSession} from 'next-auth/react'

import {ContestStatus, FindingStatus, UserRole} from '@/server/db/models'
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
import {Button} from '@/components/ui/Button'
import {useApproveOrRejectFinding} from '@/lib/queries/finding/editFinding'
import {Finding} from '@/server/actions/finding/getFinding'
import {toast} from '@/components/ui/Toast'

type FindingDetailsProps = {
  data: Omit<Finding, 'deduplicatedFinding'>
}

const FindingDetailsJudge = ({data}: FindingDetailsProps) => {
  const {data: session} = useSession()

  const {mutate} = useApproveOrRejectFinding()

  const approveFinding = () => {
    mutate(
      {findingId: data.id, newStatus: FindingStatus.APPROVED},
      {
        onSuccess: () =>
          toast({title: 'Success', description: 'Finding has been approved.'}),
      },
    )
  }
  const rejectFinding = () => {
    mutate(
      {findingId: data.id, newStatus: FindingStatus.REJECTED},
      {
        onSuccess: () =>
          toast({title: 'Success', description: 'Finding has been rejected.'}),
      },
    )
  }

  if (session?.user.role !== UserRole.JUDGE) {
    return null
  }

  return (
    <div>
      {data.contest.status === ContestStatus.APPROVED && (
        <div className="flex gap-8">
          {data.status !== FindingStatus.APPROVED && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" className="flex gap-3">
                  <span className="uppercase">Approve finding</span>
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="uppercase">
                    Are you sure you want to approve this finding?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="sr-only">
                  By approving this finding, you confirm that the finding meets
                  all the requirements and should be included.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={approveFinding}>
                    Yes, approve
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {data.status !== FindingStatus.REJECTED && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" className="flex gap-3">
                  <span className="uppercase">Reject finding</span>
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="uppercase">
                    Are you sure you want to reject this finding?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="sr-only">
                  By rejecting this finding, you confirm that the finding does
                  not meet the requirements and should not be included.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={rejectFinding}>
                    Yes, reject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  )
}

export default FindingDetailsJudge
