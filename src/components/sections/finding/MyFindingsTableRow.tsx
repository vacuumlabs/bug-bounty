import {useMemo} from 'react'
import Link from 'next/link'
import {ArrowRight} from 'lucide-react'
import {DateTime} from 'luxon'

import MyFindingsSeverityBadge from './MyFindingsSeverityBadge'

import cardanoLogo from '@public/images/cardano-logo.png'
import {MyFinding} from '@/server/actions/finding/getMyFindings'
import {TableCell, TableRow} from '@/components/ui/Table'
import {Avatar, AvatarImage} from '@/components/ui/Avatar'
import {Button} from '@/components/ui/Button'
import {getContestStatus} from '@/lib/utils/common/contest'
import {PATHS} from '@/lib/utils/common/paths'

type MyFindingsTableRowProps = {
  finding: MyFinding
}

const MyFindingsTableRow = ({finding}: MyFindingsTableRowProps) => {
  const contestStatus = useMemo(
    () => getContestStatus({...finding.contest}),
    [finding.contest],
  )

  return (
    <TableRow className="bg-grey-90">
      <TableCell>
        <div className="flex items-center gap-6">
          <Avatar>
            <AvatarImage src={cardanoLogo.src} />
          </Avatar>
          <span className="text-titleS">{finding.contest.title}</span>
        </div>
      </TableCell>
      <TableCell className="text-bodyM">{finding.title}</TableCell>
      <TableCell className="text-bodyM">
        {DateTime.fromJSDate(finding.createdAt).toLocaleString(
          DateTime.DATETIME_MED,
        )}
      </TableCell>
      <TableCell>
        <MyFindingsSeverityBadge severity={finding.severity} />
      </TableCell>
      <TableCell className="text-bodyM capitalize">{contestStatus}</TableCell>
      <TableCell className="text-bodyM capitalize">{finding.status}</TableCell>
      <TableCell>
        <Button asChild variant="outline" size="small">
          <Link
            href={`${PATHS.finding}/${finding.id}`}
            className="gap-2 text-buttonS">
            Show report
            <ArrowRight width={16} height={16} />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default MyFindingsTableRow
