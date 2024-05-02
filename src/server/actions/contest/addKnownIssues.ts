'use server'

import {z} from 'zod'

import {db, schema} from '@/server/db'
import {insertKnownIssueSchema} from '@/server/db/schema/knownIssue'
import {requireServerSession} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {ServerError} from '@/lib/types/error'

const addKnownIssueSchema = insertKnownIssueSchema
  .omit({contestId: true})
  .strict()

const addKnownIssuesSchema = z.object({
  contestId: z.string().uuid(),
  knownIssues: z.array(addKnownIssueSchema),
})

export type AddKnownIssue = z.infer<typeof addKnownIssueSchema>
export type AddKnownIssuesRequest = z.infer<typeof addKnownIssuesSchema>

const addKnownIssuesAction = async (request: AddKnownIssuesRequest) => {
  const session = await requireServerSession()

  const {contestId, knownIssues} = addKnownIssuesSchema.parse(request)

  const contest = await db.query.contests.findFirst({
    columns: {authorId: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new ServerError('Contest not found.')
  }

  if (contest.authorId !== session.user.id) {
    throw new ServerError('Only contest authors can add known issues.')
  }

  const knownIssuesToInsert = knownIssues.map((knownIssue) => ({
    ...knownIssue,
    contestId,
  }))

  return db.insert(schema.knownIssues).values(knownIssuesToInsert).returning()
}

export const addKnownIssues = serializeServerErrors(addKnownIssuesAction)
