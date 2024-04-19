'use server'

import {isAfter} from 'date-fns'
import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireServerSession} from '@/server/utils/auth'

export const deleteFinding = async (findingId: string) => {
  const session = await requireServerSession()

  const finding = await db.query.findings.findFirst({
    columns: {authorId: true},
    with: {contest: {columns: {endDate: true}}},
    where: (findings, {eq}) => eq(findings.id, findingId),
  })

  if (!finding) {
    throw new Error('Finding not found.')
  }

  if (finding.authorId !== session.user.id) {
    throw new Error('Only authors can delete their findings.')
  }

  if (isAfter(finding.contest.endDate, new Date())) {
    throw new Error('Contest has ended.')
  }

  await db.delete(schema.findings).where(eq(schema.findings.id, findingId))
}
