'use server'

import {z} from 'zod'

import {db, schema} from '@/server/db'
import {insertKnownIssueSchema} from '@/server/db/schema/knownIssue'
import {requireServerSession} from '@/server/utils/auth'
import {getApiZodError} from '@/lib/utils/common/error'

const addKnownIssueSchema = insertKnownIssueSchema
  .omit({contestId: true})
  .strict()

const addKnownIssuesSchema = z.object({
  contestId: z.string(),
  knownIssues: z.array(addKnownIssueSchema),
})

export type AddKnownIssue = z.infer<typeof addKnownIssueSchema>
export type AddKnownIssuesParams = z.infer<typeof addKnownIssuesSchema>

export const addKnownIssues = async (params: AddKnownIssuesParams) => {
  const session = await requireServerSession()

  const result = addKnownIssuesSchema.safeParse(params)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {contestId, knownIssues} = result.data

  const contest = await db.query.contests.findFirst({
    columns: {authorId: true},
    where: (contests, {eq}) => eq(contests.id, contestId),
  })

  if (!contest) {
    throw new Error('Contest not found.')
  }

  if (contest.authorId !== session.user.id) {
    throw new Error('Only contest authors can add known issues.')
  }

  const knownIssuesToInsert = knownIssues.map((knownIssue) => ({
    ...knownIssue,
    contestId,
  }))

  return db.insert(schema.knownIssues).values(knownIssuesToInsert).returning()
}
