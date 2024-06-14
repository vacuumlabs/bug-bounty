import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'
import {faker} from '@faker-js/faker'

import {trunacateDb} from '../utils/db'

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
import {deleteFindingAction} from '@/server/actions/finding/deleteFinding'
import {TEST_WALLET_ADDRESS} from '@/server/utils/test'

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
  filesInScope: faker.helpers.multiple(() => faker.internet.url()),
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
  status: FindingStatus.PENDING,
  affectedFiles: ['https://github.com/example-contest/file.js'],
  deduplicatedFindingId: null,
  rewardWalletAddress: TEST_WALLET_ADDRESS,
}

vi.mock('next-auth')

describe('deleteFinding', () => {
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

  it('deletes a finding successfully', async () => {
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

    const deletedFinding = await deleteFindingAction(insertedFindingId)

    const dbContest = await db.query.findings.findFirst({
      where: (findings, {eq}) => eq(findings.id, insertedFindingId),
    })

    expect(dbContest).toBeUndefined()
    expect(deletedFinding).toEqual(insertedFinding)
  })
})
