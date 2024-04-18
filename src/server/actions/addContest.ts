'use server'

import {eq} from 'drizzle-orm'

import {
  isJudge,
  requireJudgeAuth,
  requireServerSession,
} from '@/server/utils/auth'
import {
  ContestStatus,
  InsertContest,
  InsertKnownIssue,
} from '@/server/db/schema/contest'
import {db, schema} from '@/server/db'

export const addContest = async (
  contest: Omit<InsertContest, 'authorId' | 'status'>,
) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create contests")
  }

  return db
    .insert(schema.contests)
    .values({
      ...contest,
      authorId: session.user.id,
      status: ContestStatus.PENDING,
    })
    .returning()
}

export type ConfirmOrRejectContestProps = {
  contestId: string
  newStatus: ContestStatus.APPROVED | ContestStatus.REJECTED
}

export const confirmOrRejectContest = async ({
  contestId,
  newStatus,
}: ConfirmOrRejectContestProps) => {
  await requireJudgeAuth()

  const contest = await db.query.contests.findFirst({
    columns: {status: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (contest?.status !== ContestStatus.PENDING) {
    throw new Error('Only pending contests can be confirmed/rejected')
  }

  return db
    .update(schema.contests)
    .set({status: newStatus})
    .where(eq(schema.contests.id, contestId))
    .returning()
}

export type AddKnownIssuesProps = {
  contestId: string
  knownIssues: Omit<InsertKnownIssue, 'contestId'>[]
}

export const addKnownIssues = async ({
  contestId,
  knownIssues,
}: AddKnownIssuesProps) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {authorId: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (contest?.authorId !== session.user.id) {
    throw new Error('Only contest authors can add known issues')
  }

  return db
    .insert(schema.knownIssues)
    .values(
      knownIssues.map((knownIssue) => ({
        ...knownIssue,
        contestId,
      })),
    )
    .returning()
}
