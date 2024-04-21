'use server'

import {z} from 'zod'
import {isFuture, isPast} from 'date-fns'

import {db, schema} from '../../db'
import {insertFindingSchema} from '../../db/schema/finding'
import {isJudge, requireServerSession} from '../../utils/auth'

import {insertFindingAttachmentSchema} from '@/server/db/schema/findingAttachment'
import {ContestStatus, FindingStatus} from '@/server/db/models'
import {ApiZodError, getApiZodError} from '@/lib/utils/common/error'

export const addFindingSchema = insertFindingSchema
  .omit({
    deduplicatedFindingId: true,
    authorId: true,
  })
  .extend({
    status: z.enum([FindingStatus.PENDING, FindingStatus.DRAFT]),
  })
  .strict()

export const addFindingAttachmentSchema = insertFindingAttachmentSchema.omit({
  findingId: true,
  id: true,
})

const requestSchema = z.object({
  finding: addFindingSchema,
  attachments: z.array(addFindingAttachmentSchema),
})

export type AddFinding = z.infer<typeof addFindingSchema>
export type AddFindingAttachment = z.infer<typeof addFindingAttachmentSchema>

export type AddFindingParams = {
  finding: AddFinding
  attachments: AddFindingAttachment[]
}

export type AddFindingResponse = Exclude<
  Awaited<ReturnType<typeof addFinding>>,
  ApiZodError
>

export const addFinding = async (params: AddFindingParams) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create findings.")
  }

  const result = requestSchema.safeParse(params)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {finding, attachments} = result.data

  const contest = await db.query.contests.findFirst({
    where: (contests, {eq}) => eq(contests.id, finding.contestId),
  })

  if (!contest) {
    throw new Error('Contest not found.')
  }

  if (contest.authorId === session.user.id) {
    throw new Error("Contest author can't create findings.")
  }

  if (isPast(contest.endDate)) {
    throw new Error('Contest has ended.')
  }

  if (isFuture(contest.startDate)) {
    throw new Error('Contest has not started yet.')
  }

  if (contest.status !== ContestStatus.APPROVED) {
    throw new Error('Contest is not approved.')
  }

  const findings = await db
    .insert(schema.findings)
    .values({...finding, authorId: session.user.id})
    .returning()

  if (!findings[0]) {
    throw new Error('Failed to create finding.')
  }

  const findingId = findings[0].id

  const attachmentsToInsert = attachments.map((attachment) => ({
    ...attachment,
    findingId,
  }))

  const insertedAttachments = await db
    .insert(schema.findingAttachments)
    .values(attachmentsToInsert)
    .returning()

  return {
    ...findings[0],
    insertedAttachments,
  }
}
