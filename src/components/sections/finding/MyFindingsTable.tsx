import Link from 'next/link'
import {ArrowRight} from 'lucide-react'

import MyFindingsTableRow from './MyFindingsTableRow'

import {Button} from '@/components/ui/Button'
import {PATHS} from '@/lib/utils/common/paths'
import {MyFinding} from '@/server/actions/finding/getMyFinding'
import {Table, TableBody, TableHeader, TableRow} from '@/components/ui/Table'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import {SortParams} from '@/lib/utils/common/sorting'
import {MyFindingsSorting} from '@/lib/types/enums'
import {
  SearchParamsUpdater,
  SearchParamsUpdaterFactory,
} from '@/lib/hooks/useSearchParamsState'

type MyFindingsTableProps = {
  findings: MyFinding[] | undefined
  sortParams: SortParams<MyFindingsSorting> | undefined
  updateSortSearchParams: (
    params: SortParams<MyFindingsSorting>,
  ) => SearchParamsUpdater[]
  updatePageSearchParams: SearchParamsUpdaterFactory<number>
}

const MyFindingsTable = ({
  findings,
  sortParams,
  updateSortSearchParams,
  updatePageSearchParams,
}: MyFindingsTableProps) => {
  if (!findings?.length) {
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
    <Table className="border-separate border-spacing-y-6">
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow>
          <TableHeadWithSort
            title="Project"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={MyFindingsSorting.PROJECT}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Finding"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={MyFindingsSorting.FINDING}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Submitted"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={MyFindingsSorting.SUBMITTED}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Severity"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={MyFindingsSorting.SEVERITY}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Project state"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={MyFindingsSorting.PROJECT_STATE}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Status"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={MyFindingsSorting.STATUS}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {findings.map((finding) => (
          <MyFindingsTableRow key={finding.id} finding={finding} />
        ))}
      </TableBody>
    </Table>
  )
}

export default MyFindingsTable
