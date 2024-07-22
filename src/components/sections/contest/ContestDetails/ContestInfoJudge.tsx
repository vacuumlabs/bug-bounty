import {useSession} from 'next-auth/react'
import Link from 'next/link'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {useState} from 'react'

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
  AlertDialogDescription,
} from '@/components/ui/AlertDialog'
import {Contest} from '@/server/actions/contest/getContest'
import {
  DialogRoot,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import {Input} from '@/components/ui/Input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {toast} from '@/components/ui/Toast'
import {rewardsTransferAddressSchema} from '@/server/utils/validations/schemas'

type ContestInfoJudgeProps = {
  contest: Contest
}

const formSchema = z.object({
  rewardsTransferAddress: rewardsTransferAddressSchema,
})

type FormValues = z.infer<typeof formSchema>

const ContestInfoJudge = ({contest}: ContestInfoJudgeProps) => {
  const {data: session} = useSession()

  const {mutate: reviewContestMutate} = useReviewContest()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rewardsTransferAddress: '',
    },
  })

  const [openMarkAsPending, setOpenMarkAsPending] = useState(false)

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
        onSuccess: () =>
          toast({title: 'Success', description: 'Contest has been approved.'}),
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
        onSuccess: () =>
          toast({title: 'Success', description: 'Contest has been rejected.'}),
      },
    )
  }

  const markContestAsPending = ({rewardsTransferAddress}: FormValues) => {
    reviewContestMutate(
      {
        contestId: contest.id,
        newStatus: ContestStatus.PENDING,
        rewardsTransferAddress,
      },
      {
        onSuccess: () => {
          setOpenMarkAsPending(false)
          toast({
            title: 'Success',
            description: 'Contest has been marked as pending.',
          })
        },
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
          <DialogRoot
            open={openMarkAsPending}
            onOpenChange={setOpenMarkAsPending}>
            <DialogTrigger>
              <Button variant="outline" className="flex gap-3">
                <span className="uppercase">Mark as pending</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="border-0 bg-grey-90">
              <Form {...form} onSubmit={markContestAsPending}>
                <DialogHeader>
                  <DialogTitle className="text-titleM uppercase">
                    Mark as pending
                  </DialogTitle>
                  <DialogDescription className="text-bodyM text-white">
                    Provide the address the contest rewards should be
                    transferred to
                  </DialogDescription>
                </DialogHeader>

                <FormField
                  control={form.control}
                  name="rewardsTransferAddress"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Rewards transfer Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            </DialogContent>
          </DialogRoot>

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
              <AlertDialogDescription className="sr-only">
                By approving this contest, you confirm that the contest meets
                all the requirements and is ready to be published.
              </AlertDialogDescription>
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
              <AlertDialogDescription className="sr-only">
                By rejecting this contest, you confirm that the contest does not
                meet the requirements and should not be published.
              </AlertDialogDescription>
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
