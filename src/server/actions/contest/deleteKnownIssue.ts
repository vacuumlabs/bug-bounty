'use server'

import {isPast} from 'date-fns'
import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireServerSession} from '@/server/utils/auth'

export type DeleteKnownIssueResponse = Awaited<
  ReturnType<typeof deleteKnownIssue>
>

export const deleteKnownIssue = async (knownIssueId: string) => {
  const session = await requireServerSession()

  const knownIssue = await db.query.knownIssues.findFirst({
    with: {
      contest: {
        columns: {authorId: true, startDate: true},
      },
    },
    where: (knownIssues, {eq}) => eq(knownIssues.id, knownIssueId),
  })

  if (!knownIssue) {
    throw new Error('Contest known issue not found.')
  }

  if (knownIssue.contest.authorId !== session.user.id) {
    throw new Error('Only authors can delete their known issues.')
  }

  if (isPast(knownIssue.contest.startDate)) {
    throw new Error('Contest has started.')
  }

  return db
    .delete(schema.knownIssues)
    .where(eq(schema.knownIssues.id, knownIssueId))
    .returning()
}
