import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays, subDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'
import {eq, inArray} from 'drizzle-orm'

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
import {
  BEST_REPORT_BONUS,
  calculateRewardsAction,
} from '@/server/actions/reward/calculateRewards'
import {finalizeRewardsAction} from '@/server/actions/reward/finalizeRewards'

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
    targetFileUrl: 'https://github.com/example-contest/file1.js',
    deduplicatedFindingId: null,
  },
  {
    id: finding2Id,
    contestId,
    authorId: finding2AuthorId,
    description: 'This is finding 2 description.',
    title: 'Finding 2 title',
    severity: FindingSeverity.CRITICAL,
    status: FindingStatus.APPROVED,
    targetFileUrl: 'https://github.com/example-contest/file2.js',
    deduplicatedFindingId: null,
  },
  {
    id: finding3Id,
    contestId,
    authorId: finding3AuthorId,
    description: 'This is finding 3 description.',
    title: 'Finding 3 title',
    severity: FindingSeverity.INFO,
    status: FindingStatus.APPROVED,
    targetFileUrl: 'https://github.com/example-contest/file3.js',
    deduplicatedFindingId: null,
  },
  {
    id: finding4Id,
    contestId,
    authorId: finding4AuthorId,
    description: 'This is finding 4 description.',
    title: 'Finding 4 title',
    severity: FindingSeverity.HIGH,
    status: FindingStatus.APPROVED,
    targetFileUrl: 'https://github.com/example-contest/file1.js',
    deduplicatedFindingId: null,
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

describe('calculateReward finalizeReward', () => {
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
      },
      {
        id: finding2AuthorId,
        email: 'finding2Author@example.com',
      },
      {
        id: finding3AuthorId,
        email: 'finding3Author@example.com',
      },
      {
        id: finding4AuthorId,
        email: 'finding4Author@example.com',
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

    const result = await calculateRewardsAction(contestId)

    const finding1PointsPerSubmission =
      (contestSeverityWeightsToInsert.high * 0.9 ** 1) / 2 // 1 for finding1, 1 for finding4
    const finding2PointsPerSubmission =
      contestSeverityWeightsToInsert.critical * 0.9 ** 0 // only 1 finding
    const finding3PointsPerSubmission =
      contestSeverityWeightsToInsert.info * 0.9 ** 0 // only 1 finding

    const totalPoints =
      finding1PointsPerSubmission * 2 + // finding 1 and finding 4
      finding1PointsPerSubmission * BEST_REPORT_BONUS + // best report bonus for finding 1
      finding2PointsPerSubmission +
      finding2PointsPerSubmission * BEST_REPORT_BONUS + // best report bonus for finding 2
      finding3PointsPerSubmission // best report bonus for finding 3

    const rewardPerPoint = Number(contestToInsert.rewardsAmount) / totalPoints

    const finding1Reward = Math.floor(
      (1 + BEST_REPORT_BONUS) * finding1PointsPerSubmission * rewardPerPoint,
    ).toFixed(0)
    const finding2Reward = Math.floor(
      (1 + BEST_REPORT_BONUS) * finding2PointsPerSubmission * rewardPerPoint,
    ).toFixed(0)
    const finding3Reward = Math.floor(
      finding3PointsPerSubmission * rewardPerPoint,
    ).toFixed(0)
    const finding4Reward = Math.floor(
      finding1PointsPerSubmission * rewardPerPoint,
    ).toFixed(0)

    const totalReward =
      Number(finding1Reward) +
      Number(finding2Reward) +
      Number(finding3Reward) +
      Number(finding4Reward)

    expect(result).toEqual({
      totalRewards: totalReward,
      rewards: [
        {
          findingId: finding1Id,
          userId: finding1AuthorId,
          amount: finding1Reward,
        },
        {
          findingId: finding4Id,
          userId: finding4AuthorId,
          amount: finding4Reward,
        },
        {
          findingId: finding2Id,
          userId: finding2AuthorId,
          amount: finding2Reward,
        },
        {
          findingId: finding3Id,
          userId: finding3AuthorId,
          amount: finding3Reward,
        },
      ],
    })

    const finalize = await finalizeRewardsAction(contestId)

    const contestDb = await db.query.contests.findFirst({
      where: (contests, {eq}) => eq(contests.id, contestId),
    })

    const rewardsDb = await db.query.rewards.findMany()

    expect(contestDb?.status).toEqual(ContestStatus.FINISHED)
    expect(contestDb?.distributedRewardsAmount).toEqual(totalReward.toFixed(0))

    expect(finalize).toEqual(rewardsDb)
  })

  it('throws if there are pending findings', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: judgeId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const pendingFinding: InsertFinding = {
      id: uuidv4(),
      contestId,
      authorId: finding1AuthorId,
      description: 'This is a finding description.',
      title: 'Finding title',
      severity: FindingSeverity.HIGH,
      status: FindingStatus.PENDING,
      targetFileUrl: 'https://github.com/example-contest/filePending.js',
    }

    await db.insert(schema.findings).values(pendingFinding)

    await expect(async () => {
      await calculateRewardsAction(contestId)
    }).rejects.toThrowError('There are still pending findings in this contest.')
  })

  it('throws if there are no approved findings', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: judgeId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const rejectedFinding: InsertFinding = {
      id: uuidv4(),
      contestId,
      authorId: finding1AuthorId,
      description: 'This is a finding description.',
      title: 'Finding title',
      severity: FindingSeverity.HIGH,
      status: FindingStatus.REJECTED,
      targetFileUrl: 'https://github.com/example-contest/filePending.js',
    }

    await db.insert(schema.findings).values(rejectedFinding)

    await db
      .delete(schema.findings)
      .where(
        inArray(schema.findings.id, [
          finding1Id,
          finding2Id,
          finding3Id,
          finding4Id,
        ]),
      )

    await expect(async () => {
      await calculateRewardsAction(contestId)
    }).rejects.toThrowError('No approved findings found for this contest.')
  })

  it('throws if there are unassigned findings', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: judgeId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const unassignedFinding: InsertFinding = {
      id: uuidv4(),
      contestId,
      authorId: finding1AuthorId,
      description: 'This is a finding description.',
      title: 'Finding title',
      severity: FindingSeverity.HIGH,
      status: FindingStatus.APPROVED,
      targetFileUrl: 'https://github.com/example-contest/filePending.js',
    }

    await db.insert(schema.findings).values(unassignedFinding)

    await expect(async () => {
      await calculateRewardsAction(contestId)
    }).rejects.toThrowError(
      'Some approved findings are not assigned to a deduplicated finding.',
    )
  })

  it('throws if contest has not ended', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: judgeId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    await db
      .update(schema.contests)
      .set({
        endDate: addDays(new Date(), 1),
      })
      .where(eq(schema.contests.id, contestId))

    await expect(async () => {
      await calculateRewardsAction(contestId)
    }).rejects.toThrowError('Contest has not yet ended.')
  })

  it('throws if contest has already finished', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: judgeId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    await db
      .update(schema.contests)
      .set({
        status: ContestStatus.FINISHED,
      })
      .where(eq(schema.contests.id, contestId))

    await expect(async () => {
      await calculateRewardsAction(contestId)
    }).rejects.toThrowError('Rewards for this contest were already calculated.')
  })
})
