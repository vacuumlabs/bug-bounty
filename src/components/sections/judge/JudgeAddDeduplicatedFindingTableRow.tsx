import Link from 'next/link'
import {DateTime} from 'luxon'
import {VerifiedIcon} from 'lucide-react'
import {UseFormReturn} from 'react-hook-form'
import {CheckedState} from '@radix-ui/react-checkbox'

import {AddDeduplicatedFindingForm} from './JudgeAddDeduplicatedFinding'

import {TableCell, TableRow} from '@/components/ui/Table'
import {FindingToDeduplicate} from '@/server/actions/finding/getFinding'
import {formatDate} from '@/lib/utils/common/format'
import {translateEnum} from '@/lib/utils/common/enums'
import {PATHS} from '@/lib/utils/common/paths'
import {Checkbox} from '@/components/ui/Checkbox'

type JudgeAddDeduplicatedFindingTableRowProps = {
  finding: FindingToDeduplicate
  form: UseFormReturn<AddDeduplicatedFindingForm, unknown>
  removeFinding: (id: string) => void
  addFinding: (id: string) => void
}

const JudgeAddDeduplicatedFindingTableRow = ({
  finding,
  form,
  removeFinding,
  addFinding,
}: JudgeAddDeduplicatedFindingTableRowProps) => {
  const deduplicatedFindingId = finding.deduplicatedFindingId ?? ''

  const deduplicatedFindingIds = form.watch('deduplicatedFindingIds')
  const checked = deduplicatedFindingIds.some(
    (value) => value.deduplicatedFindingId === deduplicatedFindingId,
  )

  const onCheckedChange = (checked: CheckedState) => {
    if (checked) {
      addFinding(deduplicatedFindingId)
    } else {
      removeFinding(deduplicatedFindingId)
    }
  }

  return (
    <TableRow className="bg-grey-90">
      <TableCell>
        <Link href={PATHS.judgeFinding(finding.id)} className="flex gap-2">
          <span className="text-titleS underline">{finding.title}</span>
          {finding.isBestFinding && (
            <div className="flex items-center gap-1">
              <VerifiedIcon width={24} height={24} />
              <span className="text-bodyS">Best</span>
            </div>
          )}
        </Link>
      </TableCell>
      <TableCell className="text-bodyM">
        {formatDate(finding.createdAt, DateTime.DATETIME_MED)}
      </TableCell>
      <TableCell className="text-bodyM capitalize">
        {translateEnum.findingSeverity(finding.severity)}
      </TableCell>
      <TableCell>
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      </TableCell>
    </TableRow>
  )
}

export default JudgeAddDeduplicatedFindingTableRow
