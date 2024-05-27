import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'
import {expectAnyDate} from '../utils/expect'

import {
  ContestStatus,
  FindingSeverity,
  FindingStatus,
  ProjectCategory,
  UserRole,
} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {Finding, InsertFinding} from '@/server/db/schema/finding'
import {
  EditFindingRequest,
  editFindingAction,
} from '@/server/actions/finding/editFinding'

const userId = uuidv4()
const contestId = uuidv4()
const contestAuthorId = uuidv4()

const contestToInsert: InsertContest = {
  id: contestId,
  authorId: contestAuthorId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  repoBranch: 'main',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
  status: ContestStatus.PENDING,
  distributedRewardsAmount: '0',
  startDate: addDays(new Date(), 1),
  endDate: addDays(new Date(), 2),
}

const findingToInsert: InsertFinding = {
  contestId: contestId,
  authorId: userId,
  description: 'This is a finding description.',
  title: 'Finding title',
  severity: FindingSeverity.HIGH,
  status: FindingStatus.DRAFT,
  targetFileUrl: 'https://github.com/example-contest/file.js',
  deduplicatedFindingId: null,
}

vi.mock('next-auth')

describe('editFinding', () => {
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

  it('edits a finding successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const insertedContests = await db
      .insert(schema.contests)
      .values([contestToInsert])
      .returning()

    if (insertedContests.length === 0 || !insertedContests[0]) {
      throw new Error('No contest created.')
    }

    const insertedFinding = await db
      .insert(schema.findings)
      .values({...findingToInsert, status: FindingStatus.DRAFT})
      .returning()

    const insertedFindingId = insertedFinding[0]?.id

    if (insertedFinding.length === 0 || !insertedFindingId) {
      throw new Error('Finding not found.')
    }

    const editFindingRequest: EditFindingRequest = {
      finding: {
        id: insertedFindingId,
        description: 'This is an updated finding description.',
        title: 'Updated finding title',
        severity: FindingSeverity.LOW,
        status: FindingStatus.PENDING,
        targetFileUrl: 'https://github.com/example-contest/file-2.js',
      },
    }

    const result = await editFindingAction(editFindingRequest)

    const dbFinding = await db.query.findings.findFirst({
      where: (findings, {eq}) => eq(findings.id, insertedFindingId),
    })

    if (!dbFinding) {
      throw new Error('Finding not found.')
    }

    expect(result).toEqual([dbFinding])

    const expectedResult: Finding = {
      id: insertedFindingId,
      title: 'Updated finding title',
      description: 'This is an updated finding description.',
      severity: FindingSeverity.LOW,
      status: FindingStatus.PENDING,
      targetFileUrl: 'https://github.com/example-contest/file-2.js',
      contestId,
      authorId: userId,
      createdAt: expectAnyDate,
      updatedAt: expectAnyDate,
      deduplicatedFindingId: null,
    }

    expect(result).toEqual([expectedResult])
  })
})
