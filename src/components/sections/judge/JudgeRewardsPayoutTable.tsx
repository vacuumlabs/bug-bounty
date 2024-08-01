'use client'

import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'

import JudgeRewardsPayoutTableRow from './JudgeRewardsPayoutTableRow'

import {Button} from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import {useGetRewardsPayout} from '@/lib/queries/reward/getRewards'
import {PATHS} from '@/lib/utils/common/paths'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import TablePagination from '@/components/ui/TablePagination'
import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {JudgePayoutRewardSorting} from '@/lib/types/enums'

export const JUDGE_REWARDS_PAYOUT_PAGE_SIZE = 10

type JudgeRewardsPayoutTableProps = {
  contestId: string
}

const JudgeRewardsPayoutTable = ({contestId}: JudgeRewardsPayoutTableProps) => {
  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)

  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(JudgePayoutRewardSorting)

  const {data: rewards, isLoading} = useGetRewardsPayout({
    contestId,
    pageParams: {
      limit: JUDGE_REWARDS_PAYOUT_PAGE_SIZE,
      offset: (page - 1) * JUDGE_REWARDS_PAYOUT_PAGE_SIZE,
    },
    sort: sortParams,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-[64px]" />
        <Skeleton className="h-[240px]" />
      </div>
    )
  }

  const rewardContest = rewards?.data[0]?.rewardDetails[0]?.contest

  if (!rewards?.data.length || !rewardContest) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center">
        <p className="mb-12 text-titleL uppercase">No rewards to payout...</p>
        <Button asChild>
          <Link
            href={`${PATHS.judgeContests}/?type=past&status=APPROVED`}
            className="gap-3">
            Judge contests
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-8">
        <Button variant="outline" size="small" className="flex gap-2" asChild>
          <Link href={PATHS.judgeRewards}>
            <ArrowLeft width={16} height={16} />
            Go Back
          </Link>
        </Button>
        <h1 className="text-titleL">{rewardContest.title}</h1>
      </div>
      <Table className="mt-8 border-separate border-spacing-y-6">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow>
            <TableHead>
              <span className="text-bodyM text-grey-40">User</span>
            </TableHead>
            <TableHead>
              <span className="text-bodyM text-grey-40">User Email</span>
            </TableHead>
            <TableHeadWithSort
              title="Wallet Address"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgePayoutRewardSorting.WALLET_ADDRESS}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHeadWithSort
              title="Amount"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgePayoutRewardSorting.AMOUNT}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHead>
              <span className="text-bodyM text-grey-40">Payout Date</span>
            </TableHead>
            <TableHead title="Transfer TX Hash">
              <span className="text-bodyM text-grey-40">Transfer TX Hash</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-b-0">
          {rewards.data.map((reward) => (
            <JudgeRewardsPayoutTableRow
              key={reward.rewardWalletAddress}
              reward={reward}
            />
          ))}
        </TableBody>
      </Table>

      <TablePagination
        className="mt-12"
        pageSize={JUDGE_REWARDS_PAYOUT_PAGE_SIZE}
        totalCount={rewards.pageParams.totalCount}
      />
    </>
  )
}

export default JudgeRewardsPayoutTable
