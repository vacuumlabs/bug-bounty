import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
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
import {
  AddFindingRequest,
  addFindingAction,
} from '@/server/actions/finding/addFinding'
import {Finding} from '@/server/db/schema/finding'
import {TEST_WALLET_ADDRESS} from '@/server/utils/test'

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

vi.mock('next-auth')

describe('addFinding', () => {
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

  it('creates a finding successfully', async () => {
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

    const request = {
      finding: {
        contestId: contestId,
        description: 'This is a finding description.',
        proofOfConcept: 'This is a proof of concept.',
        title: 'Finding title',
        severity: FindingSeverity.HIGH,
        status: FindingStatus.PENDING,
        affectedFiles: ['https://github.com/example-contest/file.js'],
        rewardWalletAddress: TEST_WALLET_ADDRESS,
      },
      attachments: [],
    } as const satisfies AddFindingRequest

    const result = await addFindingAction(request)

    const dbFinding = await db.query.findings.findFirst({
      where: (findings, {eq}) => eq(findings.id, result.id),
    })

    expect(dbFinding).toBeDefined()

    expect(result).toEqual({insertedAttachments: [], ...dbFinding})

    const expectedFinding: Finding = {
      authorId: userId,
      createdAt: expectAnyDate,
      updatedAt: expectAnyDate,
      deduplicatedFindingId: null,
      id: expectAnyString,
      ...request.finding,
    }

    expect(result).toEqual({insertedAttachments: [], ...expectedFinding})
  })
})
