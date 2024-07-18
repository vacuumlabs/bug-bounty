'use client'

import Link from 'next/link'

import JudgeRewardsTableRow from './JudgeRewardsTableRow'

import {Table, TableBody, TableHeader, TableRow} from '@/components/ui/Table'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import {useGetJudgeRewards} from '@/lib/queries/reward/getJudgeRewards'
import {JudgeRewardSorting} from '@/lib/types/enums'
import Skeleton from '@/components/ui/Skeleton'
import TablePagination from '@/components/ui/TablePagination'
import {Button} from '@/components/ui/Button'
import {PATHS} from '@/lib/utils/common/paths'

export const JUDGE_REWARDS_PAGE_SIZE = 10

const JudgeRewardsTable = () => {
  const [page, {getSearchParamsUpdater: updatePageSearchParams}] =
    useSearchParamsNumericState('page', 1)

  const [sortParams, {getSortParamsUpdaters: updateSortSearchParams}] =
    useSortingSearchParams(JudgeRewardSorting)

  const {data: rewardContests, isLoading} = useGetJudgeRewards({
    pageParams: {
      limit: JUDGE_REWARDS_PAGE_SIZE,
      offset: (page - 1) * JUDGE_REWARDS_PAGE_SIZE,
    },
    sort: sortParams,
  })

  if (isLoading) {
    return (
      <div className="mx-24">
        <Skeleton className="h-[240px]" />
      </div>
    )
  }

  if (!rewardContests?.data.length) {
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
    <div className="flex flex-grow flex-col bg-black px-24 pb-24 pt-8">
      <Table className="border-separate border-spacing-y-6">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow>
            <TableHeadWithSort
              title="Contest"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgeRewardSorting.TITLE}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHeadWithSort
              title="End Date"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgeRewardSorting.END_DATE}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHeadWithSort
              title="Rewards Amount"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgeRewardSorting.REWARDS_AMOUNT}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
            <TableHeadWithSort
              title="Transfer TX Hash"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgeRewardSorting.TRANSFER_TX}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-b-0">
          {rewardContests.data.map((rewardContest) => (
            <JudgeRewardsTableRow
              key={rewardContest.id}
              rewardContest={rewardContest}
            />
          ))}
        </TableBody>
      </Table>

      <TablePagination
        className="mt-12"
        pageSize={JUDGE_REWARDS_PAGE_SIZE}
        totalCount={rewardContests.pageParams.totalCount}
      />
    </div>
  )
}

export default JudgeRewardsTable
