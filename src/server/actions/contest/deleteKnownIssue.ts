'use server'

import {isPast} from 'date-fns'
import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireServerSession} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {ServerError} from '@/lib/types/error'

export type DeleteKnownIssueResponse = Awaited<
  ReturnType<typeof deleteKnownIssue>
>

export const deleteKnownIssueAction = async (knownIssueId: string) => {
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
    throw new ServerError('Contest known issue not found.')
  }

  if (knownIssue.contest.authorId !== session.user.id) {
    throw new ServerError('Only authors can delete their known issues.')
  }

  if (isPast(knownIssue.contest.startDate)) {
    throw new ServerError('Contest has started.')
  }

  return db
    .delete(schema.knownIssues)
    .where(eq(schema.knownIssues.id, knownIssueId))
    .returning()
}

export const deleteKnownIssue = serializeServerErrors(deleteKnownIssueAction)
