import JudgeContestFindingsTableRow from './JudgeContestFindingsTableRow'

import {Table, TableBody, TableHeader, TableRow} from '@/components/ui/Table'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import {SortParams} from '@/lib/utils/common/sorting'
import {JudgeContestFindingSorting} from '@/lib/types/enums'
import {
  SearchParamsUpdater,
  SearchParamsUpdaterFactory,
} from '@/lib/hooks/useSearchParamsState'
import {JudgeFindingStatus} from '@/server/db/models'
import {ContestFinding} from '@/server/actions/finding/getFinding'

type JudgeContestsTableProps = {
  findings: ContestFinding[] | undefined
  sortParams: SortParams<JudgeContestFindingSorting> | undefined
  updateSortSearchParams: (
    params: SortParams<JudgeContestFindingSorting>,
  ) => SearchParamsUpdater[]
  updatePageSearchParams: SearchParamsUpdaterFactory<number>
  findingStatus: JudgeFindingStatus
}

const JudgeContestFindingsTable = ({
  findings,
  sortParams,
  updateSortSearchParams,
  updatePageSearchParams,
  findingStatus,
}: JudgeContestsTableProps) => {
  if (!findings?.length) {
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
            sortField={JudgeContestFindingSorting.TITLE}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Submitted"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeContestFindingSorting.SUBMITTED}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          {findingStatus === JudgeFindingStatus.APPROVED && (
            <TableHeadWithSort
              title="Deduplicated Findings"
              sortParams={sortParams}
              updateSortSearchParams={updateSortSearchParams}
              sortField={JudgeContestFindingSorting.DEDUPLICATED_FINDINGS}
              searchParamsUpdaters={[updatePageSearchParams(1)]}
            />
          )}
          <TableHeadWithSort
            title="Severity"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeContestFindingSorting.SEVERITY}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {findings.map((finding) => (
          <JudgeContestFindingsTableRow key={finding.id} finding={finding} />
        ))}
      </TableBody>
    </Table>
  )
}

export default JudgeContestFindingsTable
