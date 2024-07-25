import Link from 'next/link'
import {DateTime} from 'luxon'
import {VerifiedIcon} from 'lucide-react'

import {TableCell, TableRow} from '@/components/ui/Table'
import {ContestFinding} from '@/server/actions/finding/getFinding'
import {formatDate} from '@/lib/utils/common/format'
import {translateEnum} from '@/lib/utils/common/enums'
import {Button} from '@/components/ui/Button'
import {FindingStatus} from '@/server/db/models'
import {PATHS} from '@/lib/utils/common/paths'

type JudgeContestFindingsTableRowProps = {
  finding: ContestFinding
}

const JudgeContestFindingsTableRow = ({
  finding,
}: JudgeContestFindingsTableRowProps) => {
  const getActionButton = () => {
    switch (finding.status) {
      case FindingStatus.PENDING:
        return (
          <Button asChild variant="outline" size="small">
            <Link href={PATHS.judgeFinding(finding.id)}>Review</Link>
          </Button>
        )
      case FindingStatus.APPROVED:
        return (
          <Button asChild variant="outline" size="small">
            <Link href="#">Deduplicate</Link>
          </Button>
        )
      case FindingStatus.REJECTED:
        return null
    }
  }

  return (
    <TableRow className="bg-grey-90">
      <TableCell>
        <Link href="#" className="flex gap-2">
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
      {finding.status === FindingStatus.APPROVED && (
        <TableCell className="text-bodyM capitalize">
          {finding.deduplicatedFindingsCount}
        </TableCell>
      )}
      <TableCell className="text-bodyM capitalize">
        {translateEnum.findingSeverity(finding.severity)}
      </TableCell>
      <TableCell className="text-right">{getActionButton()}</TableCell>
    </TableRow>
  )
}

export default JudgeContestFindingsTableRow
