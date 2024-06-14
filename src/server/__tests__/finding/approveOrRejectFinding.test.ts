import {Mock, beforeEach, describe, expect, it, vi} from 'vitest'
import {subDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'
import {faker} from '@faker-js/faker'

import {trunacateDb} from '../utils/db'

import {
  ContestStatus,
  FindingSeverity,
  FindingStatus,
  ProjectCategory,
  ProjectLanguage,
  UserRole,
} from '@/server/db/models'
import {InsertUser} from '@/server/db/schema/user'
import {db, schema} from '@/server/db'
import {InsertContest} from '@/server/db/schema/contest'
import {InsertFinding} from '@/server/db/schema/finding'
import {
  ApproveOrRejectFindingRequest,
  approveOrRejectFindingAction,
} from '@/server/actions/finding/approveOrRejectFinding'
import {TEST_WALLET_ADDRESS} from '@/server/utils/test'

const userId = uuidv4()
const contestId = uuidv4()
const contestAuthorId = uuidv4()

const contestRequest: InsertContest = {
  id: contestId,
  authorId: contestAuthorId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  repoBranch: 'main',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  filesInScope: faker.helpers.multiple(() => faker.internet.url()),
  projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
  projectLanguage: [ProjectLanguage.AIKEN],
  status: ContestStatus.PENDING,
  distributedRewardsAmount: '0',
  startDate: subDays(new Date(), 3),
  endDate: subDays(new Date(), 1),
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

describe('approveOrRejectFinding', () => {
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

  it('throws an error if the finding is not PENDING', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const contest = await db
      .insert(schema.contests)
      .values([{...contestRequest, status: ContestStatus.DRAFT}])
      .returning()

    if (contest.length === 0 || !contest[0]?.id) {
      throw new Error('Contest not found.')
    }

    const insertedFinding = await db
      .insert(schema.findings)
      .values({...findingToInsert, status: FindingStatus.DRAFT})
      .returning()

    const insertedFindingId = insertedFinding[0]?.id

    if (insertedFinding.length === 0 || !insertedFindingId) {
      throw new Error('Finding not found.')
    }

    const approveRequest: ApproveOrRejectFindingRequest = {
      findingId: insertedFindingId,
      newStatus: FindingStatus.APPROVED,
    }

    await expect(async () => {
      await approveOrRejectFindingAction(approveRequest)
    }).rejects.toThrowError('Only pending findings can be approved/rejected.')
  })

  it('approves a finding successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const insertedContest = await db
      .insert(schema.contests)
      .values([contestRequest])
      .returning()

    if (insertedContest.length === 0 || !insertedContest[0]?.id) {
      throw new Error('Contest not found.')
    }

    const insertedFinding = await db
      .insert(schema.findings)
      .values([findingToInsert])
      .returning()

    const insertedFindingId = insertedFinding[0]?.id

    if (insertedFinding.length === 0 || !insertedFindingId) {
      throw new Error('Finding not found.')
    }

    const approveRequest: ApproveOrRejectFindingRequest = {
      findingId: insertedFindingId,
      newStatus: FindingStatus.APPROVED,
    }

    const result = await approveOrRejectFindingAction(approveRequest)
    const approvedFinding = result[0]

    if (!approvedFinding) {
      throw new Error('Approved contest not found.')
    }

    const dbData = await db.query.findings.findFirst({
      where: (findings, {eq}) => eq(findings.id, approvedFinding.id),
    })

    expect(approvedFinding).toEqual(dbData)
    expect(dbData?.status).toEqual(FindingStatus.APPROVED)
  })

  it('rejects a finding successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const insertedContest = await db
      .insert(schema.contests)
      .values([contestRequest])
      .returning()

    if (insertedContest.length === 0 || !insertedContest[0]?.id) {
      throw new Error('Contest not found.')
    }

    const insertedFinding = await db
      .insert(schema.findings)
      .values([findingToInsert])
      .returning()

    const insertedFindingId = insertedFinding[0]?.id

    if (insertedFinding.length === 0 || !insertedFindingId) {
      throw new Error('Finding not found.')
    }

    const approveRequest: ApproveOrRejectFindingRequest = {
      findingId: insertedFindingId,
      newStatus: FindingStatus.REJECTED,
    }

    const result = await approveOrRejectFindingAction(approveRequest)
    const approvedFinding = result[0]

    if (!approvedFinding) {
      throw new Error('Rejected contest not found.')
    }

    const dbData = await db.query.findings.findFirst({
      where: (findings, {eq}) => eq(findings.id, approvedFinding.id),
    })

    expect(approvedFinding).toEqual(dbData)
    expect(dbData?.status).toEqual(FindingStatus.REJECTED)
  })
})
