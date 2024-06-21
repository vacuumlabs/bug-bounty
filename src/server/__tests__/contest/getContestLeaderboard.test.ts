import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {subDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'
import {eq} from 'drizzle-orm'
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
import {InsertContestSeverityWeights} from '@/server/db/schema/contestSeverityWeights'
import {InsertFinding} from '@/server/db/schema/finding'
import {InsertDeduplicatedFinding} from '@/server/db/schema/deduplicatedFinding'
import {finalizeRewardsAction} from '@/server/actions/reward/finalizeRewards'
import {TEST_WALLET_ADDRESS} from '@/server/utils/test'
import {getContestLeaderboard} from '@/server/actions/contest/getContestLeaderboard'

const judgeId = uuidv4()
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
  startDate: subDays(new Date(), 7),
  endDate: subDays(new Date(), 1),
}

const contestSeverityWeightsToInsert: InsertContestSeverityWeights = {
  contestId,
  low: 1,
  medium: 3,
  high: 9,
  critical: 36,
  info: 0,
}

const finding1Id = uuidv4()
const finding2Id = uuidv4()
const finding3Id = uuidv4()
const finding4Id = uuidv4()
const finding1AuthorId = uuidv4()
const finding2AuthorId = uuidv4()
const finding3AuthorId = uuidv4()
const finding4AuthorId = uuidv4()

const findingsToInsert: InsertFinding[] = [
  {
    id: finding1Id,
    contestId,
    authorId: finding1AuthorId,
    description: 'This is a finding description.',
    title: 'Finding title',
    severity: FindingSeverity.HIGH,
    status: FindingStatus.APPROVED,
    affectedFiles: ['https://github.com/example-contest/file1.js'],
    deduplicatedFindingId: null,
    rewardWalletAddress: TEST_WALLET_ADDRESS,
  },
  {
    id: finding2Id,
    contestId,
    authorId: finding2AuthorId,
    description: 'This is finding 2 description.',
    title: 'Finding 2 title',
    severity: FindingSeverity.CRITICAL,
    status: FindingStatus.APPROVED,
    affectedFiles: ['https://github.com/example-contest/file2.js'],
    deduplicatedFindingId: null,
    rewardWalletAddress: TEST_WALLET_ADDRESS,
  },
  {
    id: finding3Id,
    contestId,
    authorId: finding3AuthorId,
    description: 'This is finding 3 description.',
    title: 'Finding 3 title',
    severity: FindingSeverity.INFO,
    status: FindingStatus.APPROVED,
    affectedFiles: ['https://github.com/example-contest/file3.js'],
    deduplicatedFindingId: null,
    rewardWalletAddress: TEST_WALLET_ADDRESS,
  },
  {
    id: finding4Id,
    contestId,
    authorId: finding4AuthorId,
    description: 'This is finding 4 description.',
    title: 'Finding 4 title',
    severity: FindingSeverity.HIGH,
    status: FindingStatus.APPROVED,
    affectedFiles: ['https://github.com/example-contest/file1.js'],
    deduplicatedFindingId: null,
    rewardWalletAddress: TEST_WALLET_ADDRESS,
  },
]

const deduplicatedFinding1Id = uuidv4()
const deduplicatedFinding2Id = uuidv4()
const deduplicatedFinding3Id = uuidv4()

const deduplicatedFindingsToInsert: InsertDeduplicatedFinding[] = [
  {
    id: deduplicatedFinding1Id,
    contestId,
    description: 'This is a deduplicated finding 1 description.',
    title: 'Deduplicated finding 1 title',
    severity: FindingSeverity.HIGH,
    bestFindingId: finding1Id,
  },
  {
    id: deduplicatedFinding2Id,
    contestId,
    description: 'This is a deduplicated finding 2 description.',
    title: 'Deduplicated finding 2 title',
    severity: FindingSeverity.CRITICAL,
    bestFindingId: finding2Id,
  },
  {
    id: deduplicatedFinding3Id,
    contestId,
    description: 'This is a deduplicated finding 3 description.',
    title: 'Deduplicated finding 3 title',
    severity: FindingSeverity.INFO,
    bestFindingId: finding3Id,
  },
]

vi.mock('next-auth')

describe('getContestLeaderboard', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const users: InsertUser[] = [
      {
        id: judgeId,
        email: 'user@example.com',
      },
      {
        id: contestAuthorId,
        email: 'contestAuthor@example.com',
      },
      {
        id: finding1AuthorId,
        email: 'finding1Author@example.com',
        alias: 'alice',
      },
      {
        id: finding2AuthorId,
        email: 'finding2Author@example.com',
        alias: 'bob',
      },
      {
        id: finding3AuthorId,
        email: 'finding3Author@example.com',
        alias: 'charlie',
      },
      {
        id: finding4AuthorId,
        email: 'finding4Author@example.com',
        alias: 'david',
      },
    ]

    // Insert users
    await db.insert(schema.users).values(users)

    // Insert contest
    await db.insert(schema.contests).values([contestToInsert]).returning()

    // Insert contest severity weights
    await db
      .insert(schema.contestSeverityWeights)
      .values(contestSeverityWeightsToInsert)

    // Insert findings
    await db.insert(schema.findings).values(findingsToInsert)

    // Insert deduplicated findings
    await db
      .insert(schema.deduplicatedFindings)
      .values(deduplicatedFindingsToInsert)

    // Update findings to assign deduplicated finding
    await db
      .update(schema.findings)
      .set({deduplicatedFindingId: deduplicatedFinding1Id})
      .where(eq(schema.findings.id, finding1Id))
    await db
      .update(schema.findings)
      .set({deduplicatedFindingId: deduplicatedFinding2Id})
      .where(eq(schema.findings.id, finding2Id))
    await db
      .update(schema.findings)
      .set({deduplicatedFindingId: deduplicatedFinding3Id})
      .where(eq(schema.findings.id, finding3Id))
    await db
      .update(schema.findings)
      .set({deduplicatedFindingId: deduplicatedFinding1Id})
      .where(eq(schema.findings.id, finding4Id))
  })

  it('calculates and finalizes rewards successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: judgeId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    await finalizeRewardsAction(contestId)

    const result = await getContestLeaderboard({contestId})

    expect(result).toEqual([
      {
        alias: 'bob',
        criticalFindings: 1,
        highFindings: 0,
        infoFindings: 0,
        lowFindings: 0,
        mediumFindings: 0,
        totalBugs: 1,
        totalRewards: 834,
      },
      {
        alias: 'alice',
        criticalFindings: 0,
        highFindings: 1,
        infoFindings: 0,
        lowFindings: 0,
        mediumFindings: 0,
        totalBugs: 1,
        totalRewards: 93,
      },
      {
        alias: 'david',
        criticalFindings: 0,
        highFindings: 1,
        infoFindings: 0,
        lowFindings: 0,
        mediumFindings: 0,
        totalBugs: 1,
        totalRewards: 72,
      },
      {
        alias: 'charlie',
        criticalFindings: 0,
        highFindings: 0,
        infoFindings: 1,
        lowFindings: 0,
        mediumFindings: 0,
        totalBugs: 1,
        totalRewards: 0,
      },
    ])
  })
})
