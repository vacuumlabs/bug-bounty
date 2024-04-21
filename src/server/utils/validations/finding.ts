import {isPast} from 'date-fns'

import {requireServerSession} from '../auth'

import {db} from '@/server/db'
import {FindingStatus} from '@/server/db/schema/finding'

export const requireEditableFinding = async (findingId: string) => {
  const session = await requireServerSession()

  const finding = await db.query.findings.findFirst({
    columns: {
      authorId: true,
      status: true,
    },
    with: {
      contest: {columns: {endDate: true}},
    },
    where: (findings, {eq}) => eq(findings.id, findingId),
  })

  if (!finding) {
    throw new Error('Finding not found.')
  }

  if (finding.authorId !== session.user.id) {
    throw new Error('Only authors can update their findings.')
  }

  if (isPast(finding.contest.endDate)) {
    throw new Error('Contest has ended.')
  }

  if (
    finding.status !== FindingStatus.DRAFT &&
    finding.status !== FindingStatus.PENDING
  ) {
    throw new Error(
      'Finding cannot be changed after it’s been confirmed or rejected.',
    )
  }

  return finding
}
