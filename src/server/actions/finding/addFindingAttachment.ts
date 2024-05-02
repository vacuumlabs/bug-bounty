'use server'

import {z} from 'zod'

import {db, schema} from '@/server/db'
import {insertFindingAttachmentSchema} from '@/server/db/schema/findingAttachment'
import {requireServerSession} from '@/server/utils/auth'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {ServerError} from '@/lib/types/error'

export type AddFindingAttachmentRequest = z.infer<
  typeof insertFindingAttachmentSchema
>

const addFindingAttachmentAction = async (
  request: AddFindingAttachmentRequest,
) => {
  const session = await requireServerSession()

  const attachment = insertFindingAttachmentSchema.parse(request)

  const finding = await db.query.findings.findFirst({
    where: (findings, {eq}) => eq(findings.id, attachment.findingId),
  })

  if (!finding) {
    throw new ServerError('Finding not found.')
  }

  if (finding.authorId === session.user.id) {
    throw new ServerError('Only finding author can add attachments.')
  }

  return db.insert(schema.findingAttachments).values(attachment).returning()
}

export const addFindingAttachment = serializeServerErrors(
  addFindingAttachmentAction,
)
