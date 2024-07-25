import {useSession} from 'next-auth/react'

import {FindingStatus, UserRole} from '@/server/db/models'
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

type FindingDetailsProps = {
  data: Finding
}

const FindingDetailsJudge = ({data}: FindingDetailsProps) => {
  const {data: session} = useSession()

  const {mutate} = useApproveOrRejectFinding()

  const approveFinding = () => {
    mutate({findingId: data.id, newStatus: FindingStatus.APPROVED})
  }
  const rejectFinding = () => {
    mutate({findingId: data.id, newStatus: FindingStatus.REJECTED})
  }

  if (session?.user.role !== UserRole.JUDGE) {
    return null
  }

  return (
    <div>
      <div className="flex gap-8">
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
              By approving this finding, you confirm that the finding meets all
              the requirements and should be included.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={approveFinding}>
                Yes, approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              By rejecting this contest, you confirm that the contest does not
              meet the requirements and should not be included.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={rejectFinding}>
                Yes, reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default FindingDetailsJudge
