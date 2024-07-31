'use client'

import {useMemo, useState} from 'react'
import {ArrowLeft} from 'lucide-react'
import Link from 'next/link'

import JudgeContestFindingsTable from './JudgeContestFindingsTable'

import {Button} from '@/components/ui/Button'
import {useGetContestFindings} from '@/lib/queries/finding/getFinding'
import {useGetContest} from '@/lib/queries/contest/getContest'
import {PATHS} from '@/lib/utils/common/paths'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/Tabs'
import Separator from '@/components/ui/Separator'
import {
  useSearchParamsEnumState,
  useSearchParamsNumericState,
  useUpdateSearchParams,
} from '@/lib/hooks/useSearchParamsState'
import {JudgeFindingStatus} from '@/server/db/models'
import Skeleton from '@/components/ui/Skeleton'
import TablePagination from '@/components/ui/TablePagination'
import {formatTabCount} from '@/lib/utils/common/format'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {JudgeContestFindingSorting} from '@/lib/types/enums'
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

export const JUDGE_CONTEST_FINDINGS_PAGE_SIZE = 10

type JudgeContestFindingsProps = {
  contestId: string
}

const JudgeContestFindings = ({contestId}: JudgeContestFindingsProps) => {
  const updateSearchParams = useUpdateSearchParams()
  const [
    findingStatus,
    {getSearchParamsUpdater: updateFindingStatusSearchParams},
  ] = useSearchParamsEnumState(
    'type',
    JudgeFindingStatus,
    JudgeFindingStatus.PENDING,
  )
  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)
  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(JudgeContestFindingSorting)

  const [openFinalizeRewards, setOpenFinalizeRewards] = useState(false)
  const {mutate: finalizeRewardsMutate} = useFinalizeRewards()

  const {data: contest} = useGetContest(contestId)
  const {data: findings, isLoading} = useGetContestFindings({
    contestId,
    status: findingStatus,
    pageParams: {
      limit: JUDGE_CONTEST_FINDINGS_PAGE_SIZE,
      offset: (page - 1) * JUDGE_CONTEST_FINDINGS_PAGE_SIZE,
    },
    sort: sortParams,
  })

  const pendingCount = findings?.pageParams.pendingCount
  const approvedCount = findings?.pageParams.approvedCount
  const rejectedCount = findings?.pageParams.rejectedCount

  const currentCount = useMemo(() => {
    switch (findingStatus) {
      case JudgeFindingStatus.PENDING:
        return pendingCount
      case JudgeFindingStatus.APPROVED:
        return approvedCount
      case JudgeFindingStatus.REJECTED:
        return rejectedCount
    }
  }, [findingStatus, pendingCount, approvedCount, rejectedCount])

  const onFindingStatusChange = (value: JudgeFindingStatus) => {
    updateSearchParams([
      updatePageSearchParams(null),
      updateFindingStatusSearchParams(value),
    ])
  }

  const finalizeRewards = () => {
    finalizeRewardsMutate(contestId, {
      onSuccess: () => {
        setOpenFinalizeRewards(false)
        toast({
          title: 'Success',
          description: 'Contest rewards has been finalized.',
        })
      },
    })
  }

  return (
    <>
      <div className="mb-12 px-24">
        <div className="flex items-center gap-12">
          <Button variant="outline" size="small" asChild className="flex gap-2">
            <Link href={`${PATHS.judgeContests}?type=past`}>
              <ArrowLeft width={16} height={16} />
              Go Back
            </Link>
          </Button>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-6">
              <h1 className="text-headlineS">{contest?.title}</h1>
            </div>
            <span className="text-titleS">Findings</span>
          </div>

          {pendingCount === 0 && (
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
                    Are you sure you want to finalize the rewards for this
                    contest?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="sr-only">
                  Calculate and finalize rewards. This will also mark the
                  contest as finished.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={finalizeRewards}>
                    Yes, finalize
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <Tabs
        value={findingStatus}
        onValueChange={onFindingStatusChange}
        className="flex flex-grow flex-col">
        <TabsList className="self-start px-24">
          <TabsTrigger
            value={
              JudgeFindingStatus.PENDING
            }>{`Pending${formatTabCount(pendingCount)}`}</TabsTrigger>
          <TabsTrigger
            value={
              JudgeFindingStatus.APPROVED
            }>{`Approved${formatTabCount(approvedCount)}`}</TabsTrigger>
          <TabsTrigger
            value={
              JudgeFindingStatus.REJECTED
            }>{`Rejected${formatTabCount(rejectedCount)}`}</TabsTrigger>
        </TabsList>
        <Separator />
        <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-12">
          {isLoading ? (
            <Skeleton className="h-[240px]" />
          ) : (
            <>
              <JudgeContestFindingsTable
                findings={findings?.data}
                sortParams={sortParams}
                updatePageSearchParams={updatePageSearchParams}
                updateSortSearchParams={updateSortSearchParams}
                findingStatus={findingStatus}
              />
              {!!currentCount && (
                <TablePagination
                  className="mt-12"
                  pageSize={JUDGE_CONTEST_FINDINGS_PAGE_SIZE}
                  totalCount={currentCount}
                />
              )}
            </>
          )}
        </div>
      </Tabs>
    </>
  )
}

export default JudgeContestFindings
