'use server'

import {isBefore} from 'date-fns'
import {eq} from 'drizzle-orm'

import {db, schema} from '@/server/db'
import {requireServerSession} from '@/server/utils/auth'

export const deleteContest = async (contestId: string) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {authorId: true, startDate: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new Error('Contest not found.')
  }

  if (contest.authorId !== session.user.id) {
    throw new Error('Only authors can delete their contests.')
  }

  if (isBefore(contest.startDate, new Date())) {
    throw new Error('Contest has started.')
  }

  await db.delete(schema.contests).where(eq(schema.contests.id, contestId))
}

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

  if (isBefore(knownIssue.contest.startDate, new Date())) {
    throw new Error('Contest has started.')
  }

  await db
    .delete(schema.knownIssues)
    .where(eq(schema.knownIssues.id, knownIssueId))
}
