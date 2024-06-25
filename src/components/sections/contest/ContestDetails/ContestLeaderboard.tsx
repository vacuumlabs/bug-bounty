'use client'

import {notFound} from 'next/navigation'

import Skeleton from '@/components/ui/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import {
  useGetContestLeaderboard,
  useGetContestLeaderboardCount,
} from '@/lib/queries/contest/getContestLeaderboard'
import {formatAda} from '@/lib/utils/common/format'
import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'
import TablePagination from '@/components/ui/TablePagination'

type ContestLeaderboardProps = {
  contestId: string
}

export const CONTEST_LEADERBOARD_PAGE_SIZE = 7

const ContestLeaderboard = ({contestId}: ContestLeaderboardProps) => {
  const [page] = useSearchParamsNumericState('page', 1)
  const {data: totalSize} = useGetContestLeaderboardCount(contestId)
  const {data: leaderboard, isLoading} = useGetContestLeaderboard({
    contestId: contestId,
    limit: CONTEST_LEADERBOARD_PAGE_SIZE,
    offset: (page - 1) * CONTEST_LEADERBOARD_PAGE_SIZE,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-24">
        <Skeleton className="h-[56px]" />
        <Skeleton className="h-[56px]" />
        <Skeleton className="h-[56px]" />
        <Skeleton className="h-[56px]" />
        <Skeleton className="h-[56px]" />
      </div>
    )
  }

  if (!leaderboard) {
    return notFound()
  }

  return (
    <>
      <Table className="border-separate border-spacing-y-6">
        <TableHeader className="[&_tr]:border-b-0">
          <TableRow>
            <TableHead className="text-bodyM text-grey-40">Name</TableHead>
            <TableHead className="text-bodyM text-grey-40">Earnings</TableHead>
            <TableHead className="text-bodyM text-grey-40">
              Valid bugs
            </TableHead>
            <TableHead className="text-bodyM text-grey-40">Insights</TableHead>
            <TableHead className="text-bodyM text-grey-40">Critical</TableHead>
            <TableHead className="text-bodyM text-grey-40">High</TableHead>
            <TableHead className="text-bodyM text-grey-40">
              Medium/Low
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-b-0">
          {leaderboard.map((leaderboard, idx) => (
            <TableRow key={leaderboard.userId} className="bg-grey-90">
              <TableCell className="text-titleS">
                {idx + 1}. {leaderboard.alias ?? leaderboard.userId}
              </TableCell>
              <TableCell className="text-bodyM">
                {formatAda(leaderboard.totalRewards)}
              </TableCell>
              <TableCell className="text-bodyM">
                {leaderboard.totalBugs}
              </TableCell>
              <TableCell className="text-bodyM">
                {leaderboard.infoFindings}
              </TableCell>
              <TableCell className="text-bodyM">
                {leaderboard.criticalFindings}
              </TableCell>
              <TableCell className="text-bodyM">
                {leaderboard.highFindings}
              </TableCell>
              <TableCell className="text-bodyM">
                {leaderboard.mediumFindings + leaderboard.lowFindings}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!!totalSize?.count && (
        <TablePagination
          className="mt-12"
          pageSize={CONTEST_LEADERBOARD_PAGE_SIZE}
          totalCount={totalSize.count}
        />
      )}
    </>
  )
}

export default ContestLeaderboard
