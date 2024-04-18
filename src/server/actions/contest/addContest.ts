'use server'

import {eq} from 'drizzle-orm'
import {isAfter} from 'date-fns'
import {z} from 'zod'

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

export type AddContest = Omit<InsertContest, 'authorId' | 'status'>

export const addContest = async (contest: AddContest) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create contests.")
  }

  if (isAfter(contest.startDate, contest.endDate)) {
    throw new Error('Contest start date must be before end date.')
  }

  const checkRepoUrl = z.string().url().safeParse(contest.repoUrl)

  if (!checkRepoUrl.success) {
    throw new Error('Invalid repository URL.')
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

export type ConfirmOrRejectContestParams = {
  contestId: string
  newStatus: ContestStatus.APPROVED | ContestStatus.REJECTED
}

export const confirmOrRejectContest = async ({
  contestId,
  newStatus,
}: ConfirmOrRejectContestParams) => {
  await requireJudgeAuth()

  const contest = await db.query.contests.findFirst({
    columns: {status: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new Error('Contest not found.')
  }

  if (contest.status !== ContestStatus.PENDING) {
    throw new Error('Only pending contests can be confirmed/rejected.')
  }

  return db
    .update(schema.contests)
    .set({status: newStatus})
    .where(eq(schema.contests.id, contestId))
    .returning()
}

export type AddKnownIssue = Omit<InsertKnownIssue, 'contestId'>

export type AddKnownIssuesParams = {
  contestId: string
  knownIssues: AddKnownIssue[]
}

export const addKnownIssues = async ({
  contestId,
  knownIssues,
}: AddKnownIssuesParams) => {
  const session = await requireServerSession()

  const contest = await db.query.contests.findFirst({
    columns: {authorId: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (contest?.authorId !== session.user.id) {
    throw new Error('Only contest authors can add known issues.')
  }

  const knownIssuesToInsert = knownIssues.map((knownIssue) => ({
    ...knownIssue,
    contestId,
  }))

  return db.insert(schema.knownIssues).values(knownIssuesToInsert).returning()
}
