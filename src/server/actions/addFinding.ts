import {db, schema} from '../db'
import {InsertFinding} from '../db/schema/finding'
import {isJudge, requireServerSession} from '../utils/auth'

export type AddFinding = Omit<
  InsertFinding,
  'id' | 'createdAt' | 'updatedAt' | 'deduplicatedFindingId'
>

export type AddFindingProps = {
  finding: AddFinding
  findingAttachmentUrls: string[]
}

export const addFinding = async ({
  finding,
  findingAttachmentUrls,
}: AddFindingProps) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create findings")
  }

  const findings = await db.insert(schema.findings).values(finding).returning()

  if (!findings[0]) {
    throw new Error('Failed to create finding')
  }

  const findingId = findings[0].id

  const findingAttachmentsToInsert = findingAttachmentUrls.map((url) => ({
    findingId,
    attachmentUrl: url,
  }))

  await db.insert(schema.findingAttachments).values(findingAttachmentsToInsert)

  return findings[0]
}
