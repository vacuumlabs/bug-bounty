import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {subDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'
import {eq} from 'drizzle-orm'

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
import {InsertContestSeverityWeights} from '@/server/db/schema/contestSeverityWeights'
import {InsertFinding} from '@/server/db/schema/finding'
import {InsertDeduplicatedFinding} from '@/server/db/schema/deduplicatedFinding'
import {InsertReward} from '@/server/db/schema/reward'
import {getRewards} from '@/server/actions/reward/getReward'

const judgeId = uuidv4()
const contestId = uuidv4()
const contestAuthorId = uuidv4()

const contestToInsert: InsertContest = {
  id: contestId,
  authorId: contestAuthorId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
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

const finding1AuthorId = uuidv4()

const findingsToInsert: InsertFinding[] = [
  {
    id: finding1Id,
    contestId,
    authorId: finding1AuthorId,
    description: 'This is a finding description.',
    title: 'Finding title',
    severity: FindingSeverity.HIGH,
    status: FindingStatus.APPROVED,
    targetFileUrl: 'https://github.com/example-contest/file1.js',
    deduplicatedFindingId: null,
  },
]

const deduplicatedFinding1Id = uuidv4()

const deduplicatedFindingsToInsert: InsertDeduplicatedFinding[] = [
  {
    id: deduplicatedFinding1Id,
    contestId,
    description: 'This is a deduplicated finding 1 description.',
    title: 'Deduplicated finding 1 title',
    severity: FindingSeverity.HIGH,
    bestFindingId: finding1Id,
  },
]

const rewardToInsert: InsertReward = {
  amount: '1000',
  findingId: finding1Id,
  userId: finding1AuthorId,
}

vi.mock('next-auth')

describe('getReward', () => {
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
        name: 'finding1Author',
        alias: 'finding1Author',
        image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
        walletAddress:
          'addr1qx2fxv4am9j0dmqscsk8y8sm9f2fsrxslt7vft5hpm7euv9u7a6xs07hs92m60fyzhqjfj83uw97rf5vmrsjnsw8d35s6f4vlg',
      },
    ]

    await db.insert(schema.users).values(users)
  })

  it('gets rewards successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: judgeId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

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

    // Insert rewards
    await db.insert(schema.rewards).values(rewardToInsert)

    const result = await getRewards({
      findingId: finding1Id,
      limit: 10,
    })

    expect(result).toEqual([
      {
        user: {
          name: 'finding1Author',
          alias: 'finding1Author',
          image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
          walletAddress:
            'addr1qx2fxv4am9j0dmqscsk8y8sm9f2fsrxslt7vft5hpm7euv9u7a6xs07hs92m60fyzhqjfj83uw97rf5vmrsjnsw8d35s6f4vlg',
        },
        id: expectAnyString,
        userId: finding1AuthorId,
        createdAt: expectAnyDate,
        updatedAt: expectAnyDate,
        amount: '1000',
        findingId: finding1Id,
        payoutDate: null,
        transferTxHash: null,
      },
    ])
  })
})
