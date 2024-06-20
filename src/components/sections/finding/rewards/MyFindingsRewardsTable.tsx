'use client'

import {ArrowRight} from 'lucide-react'
import Link from 'next/link'

import MyFindingsRewardsTableRow from './MyFindingsRewardsTableRow'

import {Button} from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import {PATHS} from '@/lib/utils/common/paths'
import {
  useGetMyFindingsRewards,
  useGetMyFindingsRewardsSize,
} from '@/lib/queries/reward/getMyFindingsRewards'
import TablePagination from '@/components/ui/TablePagination'
import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'
import {useSortingSearchParams} from '@/lib/hooks/useSortingSearchParams'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import {MyFindingsRewardsSorting} from '@/lib/types/enums'

export const MY_FINDINGS_REWARDS_PAGE_SIZE = 7

const MyFindingsRewardsTable = () => {
  const [page] = useSearchParamsNumericState('page', 1)
  const [sortParams, setSortParams] = useSortingSearchParams(
    MyFindingsRewardsSorting,
  )

  const {data: totalSize} = useGetMyFindingsRewardsSize()
  const {data, isLoading} = useGetMyFindingsRewards({
    limit: MY_FINDINGS_REWARDS_PAGE_SIZE,
    offset: (page - 1) * MY_FINDINGS_REWARDS_PAGE_SIZE,
    sort: sortParams,
  })

  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col gap-6">
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
        <Skeleton className="h-[72px]" />
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center">
        <p className="mb-12 text-titleL uppercase">There is nothing yet...</p>
        <Button asChild>
          <Link href={PATHS.newFinding} className="gap-3">
            Submit Report
            <ArrowRight />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Table className="border-separate border-spacing-y-6 ">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow>
            <TableHeadWithSort
              title="Projects"
              sortParams={sortParams}
              setSortParams={setSortParams}
              sortField={MyFindingsRewardsSorting.PROJECT}
            />
            <TableHeadWithSort
              title="Submitted"
              sortParams={sortParams}
              setSortParams={setSortParams}
              sortField={MyFindingsRewardsSorting.SUBMITTED}
            />
            <TableHeadWithSort
              title="Reviewed"
              sortParams={sortParams}
              setSortParams={setSortParams}
              sortField={MyFindingsRewardsSorting.REVIEWED}
            />
            <TableHeadWithSort
              title="Severity"
              sortParams={sortParams}
              setSortParams={setSortParams}
              sortField={MyFindingsRewardsSorting.SEVERITY}
            />
            <TableHeadWithSort
              title="Reward"
              sortParams={sortParams}
              setSortParams={setSortParams}
              sortField={MyFindingsRewardsSorting.REWARD}
            />
            <TableHeadWithSort
              title="State"
              sortParams={sortParams}
              setSortParams={setSortParams}
              sortField={MyFindingsRewardsSorting.STATE}
            />
            <TableHead className="text-bodyM text-grey-40" />
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-b-0">
          {data.map((data) => (
            <MyFindingsRewardsTableRow key={data.reward.id} data={data} />
          ))}
        </TableBody>
      </Table>

      {!!totalSize?.count && (
        <TablePagination
          className="mt-12"
          pageSize={MY_FINDINGS_REWARDS_PAGE_SIZE}
          totalCount={totalSize.count}
        />
      )}
    </>
  )
}

export default MyFindingsRewardsTable
