import {describe, it, vi, Mock, beforeEach, expect} from 'vitest'
import {addDays, subDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'
import {expectAnyDate, expectAnyString} from '../utils/expect'

import {
  ContestStatus,
  FindingSeverity,
  FindingStatus,
  UserRole,
} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {InsertFinding} from '@/server/db/schema/finding'
import {
  AddFindingAttachmentRequest,
  addFindingAttachmentAction,
} from '@/server/actions/finding/addFindingAttachment'
import {FindingAttachment} from '@/server/db/schema/findingAttachment'

const userId = uuidv4()
const contestId = uuidv4()
const contestAuthorId = uuidv4()

const contestsToInsert: InsertContest = {
  id: contestId,
  authorId: contestAuthorId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  repoBranch: 'main',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  status: ContestStatus.APPROVED,
  distributedRewardsAmount: '0',
  startDate: subDays(new Date(), 1),
  endDate: addDays(new Date(), 2),
}

const findingToInsert: InsertFinding = {
  contestId: contestId,
  authorId: userId,
  description: 'This is a finding description.',
  title: 'Finding title',
  severity: FindingSeverity.HIGH,
  status: FindingStatus.PENDING,
  targetFileUrl: 'https://github.com/example-contest/file.js',
  deduplicatedFindingId: null,
}

vi.mock('next-auth')

describe('addFindingAttachment', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const users: InsertUser[] = [
      {
        id: userId,
        email: 'user@example.com',
      },
      {
        id: contestAuthorId,
        email: 'contestAuthor@example.com',
      },
    ]

    await db.insert(schema.users).values(users)
  })

  it('adds a finding attachment successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const insertedContest = await db
      .insert(schema.contests)
      .values(contestsToInsert)
      .returning()

    if (insertedContest.length !== 1) {
      throw new Error('Failed to insert contest.')
    }

    const insertedFinding = await db
      .insert(schema.findings)
      .values(findingToInsert)
      .returning()

    const insertedFindingId = insertedFinding[0]?.id

    if (insertedFinding.length !== 1 || !insertedFindingId) {
      throw new Error('Failed to insert findings.')
    }

    const request: AddFindingAttachmentRequest = {
      attachmentUrl: 'https://example-file.com/file.txt',
      findingId: insertedFindingId,
    }

    const result = await addFindingAttachmentAction(request)

    const dbFindingAttachment = await db.query.findingAttachments.findFirst({
      where: (attachments, {eq}) =>
        eq(attachments.findingId, insertedFindingId),
    })

    expect(result).toEqual([dbFindingAttachment])

    const expectedFindingAttachment: FindingAttachment = {
      attachmentUrl: request.attachmentUrl,
      createdAt: expectAnyDate,
      updatedAt: expectAnyDate,
      findingId: insertedFindingId,
      id: expectAnyString,
      mimeType: null,
    }

    expect(result).toEqual([expectedFindingAttachment])
  })
})
