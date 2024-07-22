import JudgeContestsTableRow from './JudgeContestsTableRow'

import {Table, TableBody, TableHeader, TableRow} from '@/components/ui/Table'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import {SortParams} from '@/lib/utils/common/sorting'
import {JudgeContestSorting} from '@/lib/types/enums'
import {
  SearchParamsUpdater,
  SearchParamsUpdaterFactory,
} from '@/lib/hooks/useSearchParamsState'
import {JudgeContest} from '@/server/actions/contest/getJudgeContests'
import {ContestOccurence} from '@/server/db/models'

type JudgeContestsTableProps = {
  contests: JudgeContest[] | undefined
  sortParams: SortParams<JudgeContestSorting> | undefined
  updateSortSearchParams: (
    params: SortParams<JudgeContestSorting>,
  ) => SearchParamsUpdater[]
  updatePageSearchParams: SearchParamsUpdaterFactory<number>
  contestOccurence: ContestOccurence
}

const JudgeContestsTable = ({
  contests,
  sortParams,
  updateSortSearchParams,
  updatePageSearchParams,
  contestOccurence,
}: JudgeContestsTableProps) => {
  if (!contests?.length) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center">
        <p className="mb-12 text-titleL uppercase">There is nothing yet...</p>
      </div>
    )
  }

  return (
    <Table className="border-separate border-spacing-y-6">
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow>
          <TableHeadWithSort
            title="Title"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeContestSorting.TITLE}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          {contestOccurence === ContestOccurence.FUTURE && (
            <TableHeadWithSort
              title="Submitted"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgeContestSorting.SUBMITTED}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
          )}
          <TableHeadWithSort
            title="Start"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeContestSorting.START_DATE}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="End"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeContestSorting.END_DATE}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Reward Amount"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeContestSorting.REWARDS_AMOUNT}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          {contestOccurence !== ContestOccurence.FUTURE && (
            <TableHeadWithSort
              title="Pending Findings"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgeContestSorting.PENDING_FINDINGS}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
          )}
          {contestOccurence === ContestOccurence.PAST && (
            <>
              <TableHeadWithSort
                title="Approved Findings"
                sortParams={sortParams}
                updateSortSearchParams={updateSortSearchParams}
                sortField={JudgeContestSorting.APPROVED_FINDINGS}
                searchParamsUpdaters={[updatePageSearchParams(1)]}
              />
              <TableHeadWithSort
                title="Rejected Findings"
                sortParams={sortParams}
                updateSortSearchParams={updateSortSearchParams}
                sortField={JudgeContestSorting.REJECTED_FINDINGS}
                searchParamsUpdaters={[updatePageSearchParams(1)]}
              />
              <TableHeadWithSort
                title="Rewarded Auditors"
                sortParams={sortParams}
                updateSortSearchParams={updateSortSearchParams}
                sortField={JudgeContestSorting.REWARDED_AUDITORS}
                searchParamsUpdaters={[updatePageSearchParams(1)]}
              />
            </>
          )}
          <TableHeadWithSort
            title="Status"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeContestSorting.STATUS}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {contests.map((contest) => (
          <JudgeContestsTableRow
            key={contest.id}
            contest={contest}
            contestOccurence={contestOccurence}
          />
        ))}
      </TableBody>
    </Table>
  )
}

export default JudgeContestsTable
