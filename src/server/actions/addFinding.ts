import {isAfter, isBefore} from 'date-fns'
import {db, schema} from '../db'
import {InsertFinding} from '../db/schema/finding'
import {isJudge, requireServerSession} from '../utils/auth'

export type AddFinding = Omit<
  InsertFinding,
  'deduplicatedFindingId' | 'authorId'
>

export type AddFindingProps = {
  finding: AddFinding
  findingAttachmentUrls: string[]
}

export type AddFindingReturn = Awaited<ReturnType<typeof addFinding>>

export const addFinding = async ({
  finding,
  findingAttachmentUrls,
}: AddFindingProps) => {
  const session = await requireServerSession()

  if (isJudge(session)) {
    throw new Error("Judges can't create findings.")
  }

  const contest = await db.query.contests.findFirst({
    where: (contests, {eq}) => eq(contests.id, finding.contestId),
  })

  if (!contest) {
    throw new Error('Contest not found.')
  }

  if (contest.authorId === session.user.id) {
    throw new Error("Contest author can't create findings.")
  }

  if (isAfter(contest.endDate, new Date())) {
    throw new Error('Contest has ended.')
  }

  if (isBefore(contest.startDate, new Date())) {
    throw new Error('Contest has not started yet.')
  }

  const findings = await db
    .insert(schema.findings)
    .values({...finding, authorId: session.user.id})
    .returning()

  if (!findings[0]) {
    throw new Error('Failed to create finding.')
  }

  const findingId = findings[0].id

  const findingAttachmentsToInsert = findingAttachmentUrls.map((url) => ({
    findingId,
    attachmentUrl: url,
  }))

  const findingAttachments = await db
    .insert(schema.findingAttachments)
    .values(findingAttachmentsToInsert)
    .returning()

  return {
    ...findings[0],
    findingAttachments,
  }
}
