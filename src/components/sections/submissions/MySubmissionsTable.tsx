import Link from 'next/link'
import {ArrowRight} from 'lucide-react'

import MySubmissionsTableRow from './MySubmissionsTableRow'

import {Button} from '@/components/ui/Button'
import {PATHS} from '@/lib/utils/common/paths'
import {MyFinding} from '@/server/actions/finding/getMyFindings'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type MySubmissionsListProps = {
  findings: MyFinding[] | undefined
}

const MySubmissionsTable = ({findings}: MySubmissionsListProps) => {
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
    <Table className="border-separate border-spacing-y-6 hover:bg-transparent">
      <TableHeader className="[&_tr]:border-b-0 [&_tr]:hover:bg-transparent">
        <TableRow>
          <TableHead className="text-bodyM text-grey-40">Project</TableHead>
          <TableHead className="text-bodyM text-grey-40">Finding</TableHead>
          <TableHead className="text-bodyM text-grey-40">Submitted</TableHead>
          <TableHead className="text-bodyM text-grey-40">Severity</TableHead>
          <TableHead className="text-bodyM text-grey-40">
            Project state
          </TableHead>
          <TableHead className="text-bodyM text-grey-40">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0 [&_tr]:hover:bg-grey-90">
        {findings.map((finding) => (
          <MySubmissionsTableRow key={finding.id} finding={finding} />
        ))}
      </TableBody>
    </Table>
  )
}

export default MySubmissionsTable
