'use server'

import {z} from 'zod'
import {isFuture, isPast} from 'date-fns'

import {db, schema} from '../../db'
import {isJudge, requireServerSession} from '../../utils/auth'

import {ContestStatus} from '@/server/db/models'
import {ApiZodError, serializeServerErrors} from '@/lib/utils/common/error'
import {
  addFindingAttachmentSchema,
  addFindingSchema,
} from '@/server/utils/validations/schemas'
import {ServerError} from '@/lib/types/error'

const requestSchema = z.object({
  finding: addFindingSchema,
  attachments: z.array(addFindingAttachmentSchema),
})

export type AddFinding = z.infer<typeof addFindingSchema>
export type AddFindingAttachment = z.infer<typeof addFindingAttachmentSchema>

export type AddFindingRequest = {
  finding: AddFinding
  attachments: AddFindingAttachment[]
}

export type AddFindingResponse = Exclude<
  Awaited<ReturnType<typeof addFinding>>,
  ApiZodError
>

const addFindingAction = async (request: AddFindingRequest) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new ServerError("Judges can't create findings.")
  }

  const {finding, attachments} = requestSchema.parse(request)

  const contest = await db.query.contests.findFirst({
    where: (contests, {eq}) => eq(contests.id, finding.contestId),
  })

  if (!contest) {
    throw new ServerError('Contest not found.')
  }

  if (contest.authorId === session.user.id) {
    throw new ServerError("Contest author can't create findings.")
  }

  if (isPast(contest.endDate)) {
    throw new ServerError('Contest has ended.')
  }

  if (isFuture(contest.startDate)) {
    throw new ServerError('Contest has not started yet.')
  }

  if (contest.status !== ContestStatus.APPROVED) {
    throw new ServerError('Contest is not approved.')
  }

  return db.transaction(async (tx) => {
    const findings = await tx
      .insert(schema.findings)
      .values({...finding, authorId: session.user.id})
      .returning()

    const insertedFinding = findings[0]

    if (!insertedFinding) {
      throw new ServerError('Failed to create finding.')
    }

    if (attachments.length === 0) {
      return {
        ...insertedFinding,
        insertedAttachments: [],
      }
    }

    const attachmentsToInsert = attachments.map((attachment) => ({
      ...attachment,
      findingId: insertedFinding.id,
    }))

    const insertedAttachments = await tx
      .insert(schema.findingAttachments)
      .values(attachmentsToInsert)
      .returning()

    return {
      ...insertedFinding,
      insertedAttachments,
    }
  })
}

export const addFinding = serializeServerErrors(addFindingAction)
