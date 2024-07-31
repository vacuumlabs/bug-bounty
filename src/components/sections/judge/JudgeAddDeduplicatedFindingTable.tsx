import {useFieldArray, UseFormReturn} from 'react-hook-form'

import JudgeAddDeduplicatedFindingTableRow from './JudgeAddDeduplicatedFindingTableRow'
import {AddDeduplicatedFindingForm} from './JudgeAddDeduplicatedFinding'

import {Table, TableBody, TableHeader, TableRow} from '@/components/ui/Table'
import TableHeadWithSort from '@/components/ui/TableHeadWithSort'
import {
  SearchParamsUpdater,
  SearchParamsUpdaterFactory,
} from '@/lib/hooks/useSearchParamsState'
import {JudgeFindingToDeduplicateSorting} from '@/lib/types/enums'
import {SortParams} from '@/lib/utils/common/sorting'
import {FindingToDeduplicate} from '@/server/actions/finding/getFinding'

type JudgeAddDeduplicatedFindingTableProps = {
  findings: FindingToDeduplicate[] | undefined
  sortParams: SortParams<JudgeFindingToDeduplicateSorting> | undefined
  updateSortSearchParams: (
    params: SortParams<JudgeFindingToDeduplicateSorting>,
  ) => SearchParamsUpdater[]
  updatePageSearchParams: SearchParamsUpdaterFactory<number>
  form: UseFormReturn<AddDeduplicatedFindingForm, unknown>
}

const JudgeAddDeduplicatedFindingTable = ({
  findings,
  sortParams,
  updateSortSearchParams,
  updatePageSearchParams,
  form,
}: JudgeAddDeduplicatedFindingTableProps) => {
  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: 'deduplicatedFindingIds',
  })

  const removeFinding = (id: string) => {
    const idx = fields.findIndex((field) => field.deduplicatedFindingId === id)

    if (idx === -1) return

    remove(idx)
  }

  const addFinding = (id: string) => {
    const exists = fields.some((field) => field.deduplicatedFindingId === id)
    if (exists) return
    append({deduplicatedFindingId: id})
  }

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
            sortField={JudgeFindingToDeduplicateSorting.TITLE}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Submitted"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeFindingToDeduplicateSorting.SUBMITTED}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
          <TableHeadWithSort
            title="Severity"
            sortParams={sortParams}
            updateSortSearchParams={updateSortSearchParams}
            sortField={JudgeFindingToDeduplicateSorting.SEVERITY}
            searchParamsUpdaters={[updatePageSearchParams(1)]}
          />
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {findings.map((finding) => (
          <JudgeAddDeduplicatedFindingTableRow
            key={finding.id}
            finding={finding}
            form={form}
            removeFinding={removeFinding}
            addFinding={addFinding}
          />
        ))}
      </TableBody>
    </Table>
  )
}

export default JudgeAddDeduplicatedFindingTable
