'use client'

import Link from 'next/link'
import {ArrowLeft, Trash2} from 'lucide-react'
import {notFound, useRouter} from 'next/navigation'
import {DateTime} from 'luxon'

import FindingDetails from './FindingDetails'

import {Button} from '@/components/ui/Button'
import Separator from '@/components/ui/Separator'
import Skeleton from '@/components/ui/Skeleton'
import {formatAda, formatDate} from '@/lib/utils/common/format'
import {getContestStatusText} from '@/lib/utils/common/contest'
import {useGetMyFinding} from '@/lib/queries/finding/getMyFinding'
import {PATHS} from '@/lib/utils/common/paths'
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
import {useDeleteFinding} from '@/lib/queries/finding/deleteFinding'
import {FindingStatus} from '@/server/db/models'
import {translateEnum} from '@/lib/utils/common/enums'

type MyFindingDetailsProps = {
  findingId: string
}

const MyFindingDetails = ({findingId}: MyFindingDetailsProps) => {
  const {data, isLoading} = useGetMyFinding({findingId})
  const {mutate, isPending} = useDeleteFinding()
  const router = useRouter()

  if (isLoading || isPending) {
    return (
      <div className="px-24">
        <div className="mb-12">
          <Skeleton className="h-[72px]" />
        </div>
        <Separator />
        <div className="mt-12 flex flex-col gap-3">
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
        </div>
      </div>
    )
  }

  if (!data) {
    return notFound()
  }

  const isFindingDeletable =
    DateTime.fromJSDate(data.contest.endDate) > DateTime.now() &&
    (data.status === FindingStatus.DRAFT ||
      data.status === FindingStatus.PENDING)

  const contestStatusText = getContestStatusText({
    startDate: data.contest.startDate,
    endDate: data.contest.endDate,
    status: data.contest.status,
  })

  return (
    <>
      <div className="flex h-[136px] items-center gap-12 px-24">
        <Button
          variant="outline"
          size="small"
          className="flex gap-2 uppercase"
          onClick={() => router.back()}>
          <ArrowLeft width={16} height={16} />
          Go Back
        </Button>
      </div>

      <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12 xl:px-[340px]">
        <div className="mb-12 flex flex-col gap-3">
          <h3 className="text-bodyL text-purple-light">Your wallet address</h3>
          <span className="text-bodyM">{data.rewardWalletAddress}</span>
        </div>

        <div className="mb-12 flex gap-12">
          <div className="flex flex-col">
            <span className="text-bodyL text-purple-light">Project name</span>
            <span className="text-bodyM">{data.contest.title}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-bodyL text-purple-light">Submitted</span>
            <span className="text-bodyM">
              {formatDate(data.createdAt, DateTime.DATETIME_MED)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-bodyL text-purple-light">Project state</span>
            <span className="text-bodyM capitalize">
              {translateEnum.contestStatusText(contestStatusText)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-bodyL text-purple-light">Reward</span>
            <span className="text-bodyM">
              {data.reward?.amount ? formatAda(data.reward.amount) : '-'}
            </span>
          </div>
        </div>

        <FindingDetails data={data} />

        <div className="flex justify-between">
          {isFindingDeletable && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" className="flex gap-3">
                  <Trash2 width={16} height={16} />
                  <span className="uppercase">Delete report</span>
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="uppercase">
                    Are you sure you want to delete this report?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      mutate(findingId, {
                        onSuccess: () => router.push(PATHS.myFindings),
                      })
                    }>
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button variant="default" asChild>
            <Link href={PATHS.myFindings}>
              <span className="uppercase">Back to my submissions</span>
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}

export default MyFindingDetails
