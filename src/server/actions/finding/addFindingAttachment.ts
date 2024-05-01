'use server'

import {z} from 'zod'

import {db, schema} from '@/server/db'
import {insertFindingAttachmentSchema} from '@/server/db/schema/findingAttachment'
import {requireServerSession} from '@/server/utils/auth'
import {getApiZodError} from '@/lib/utils/common/error'

export type AddFindingAttachmentRequest = z.infer<
  typeof insertFindingAttachmentSchema
>

export const addFindingAttachment = async (
  request: AddFindingAttachmentRequest,
) => {
  const session = await requireServerSession()

  const result = insertFindingAttachmentSchema.safeParse(request)

  if (!result.success) {
    return getApiZodError(result.error)
  }

  const {findingId} = result.data

  const finding = await db.query.findings.findFirst({
    where: (findings, {eq}) => eq(findings.id, findingId),
  })

  if (!finding) {
    throw new Error('Finding not found.')
  }

  if (finding.authorId === session.user.id) {
    throw new Error('Only finding author can add attachments.')
  }

  return db.insert(schema.findingAttachments).values(result.data).returning()
}
