import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays, subDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {
  ContestStatus,
  FindingSeverity,
  FindingStatus,
  ProjectCategory,
  ProjectLanguage,
  UserRole,
} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {
  MergeDeduplicatedFindingsRequest,
  mergeDeduplicatedFindingsAction,
} from '@/server/actions/deduplicatedFinding/mergeDeduplicatedFindings'
import {InsertFinding} from '@/server/db/schema/finding'
import {InsertDeduplicatedFinding} from '@/server/db/schema/deduplicatedFinding'

const userId = uuidv4()
const contestId = uuidv4()

const contestToInsert: InsertContest = {
  id: contestId,
  authorId: userId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
  projectLanguage: [ProjectLanguage.AIKEN],
  status: ContestStatus.APPROVED,
  distributedRewardsAmount: '0',
  startDate: subDays(new Date(), 5),
  endDate: subDays(new Date(), 2),
}

const bestDeduplicatedFindingId = uuidv4()
const deduplicatedFinding2Id = uuidv4()
const deduplicatedFinding3Id = uuidv4()

const deduplicatedFindingsToInsert: InsertDeduplicatedFinding[] = [
  {
    id: bestDeduplicatedFindingId,
    contestId,
    title: 'Deduplicated finding 1',
    description: 'Deduplicated finding 1 description',
    severity: FindingSeverity.HIGH,
  },
  {
    id: deduplicatedFinding2Id,
    contestId,
    title: 'Deduplicated finding 2',
    description: 'Deduplicated finding 2 description',
    severity: FindingSeverity.MEDIUM,
  },
  {
    id: deduplicatedFinding3Id,
    contestId,
    title: 'Deduplicated finding 3',
    description: 'Deduplicated finding 3 description',
    severity: FindingSeverity.INFO,
  },
]

const findingsToInsert: InsertFinding[] = [
  {
    authorId: userId,
    contestId,
    title: 'Finding 1',
    description: 'Finding 1 description',
    severity: FindingSeverity.HIGH,
    status: FindingStatus.APPROVED,
    targetFileUrl: 'http://exampleurl.com',
    deduplicatedFindingId: bestDeduplicatedFindingId,
  },
  {
    authorId: userId,
    contestId,
    title: 'Finding 2',
    description: 'Finding 2 description',
    severity: FindingSeverity.MEDIUM,
    status: FindingStatus.APPROVED,
    targetFileUrl: 'http://exampleurl.com',
    deduplicatedFindingId: deduplicatedFinding2Id,
  },
  {
    authorId: userId,
    contestId,
    title: 'Finding 3',
    description: 'Finding 3 description',
    severity: FindingSeverity.INFO,
    status: FindingStatus.APPROVED,
    targetFileUrl: 'http://exampleurl.com',
    deduplicatedFindingId: deduplicatedFinding3Id,
  },
]

const request: MergeDeduplicatedFindingsRequest = {
  bestDeduplicatedFindingId: bestDeduplicatedFindingId,
  deduplicatedFindingIds: [deduplicatedFinding2Id, deduplicatedFinding3Id],
}

vi.mock('next-auth')

describe('mergeDeduplicatedFindings', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: userId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('merges deduplicated findings successfully', async () => {
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
      .values(contestToInsert)
      .returning()

    if (insertedContest.length !== 1) {
      throw new Error('Failed to insert contest')
    }

    const insertedDeduplicatedFindings = await db
      .insert(schema.deduplicatedFindings)
      .values(deduplicatedFindingsToInsert)
      .returning()

    if (insertedDeduplicatedFindings.length !== 3) {
      throw new Error('Failed to insert deduplicated findings')
    }

    const insertedFindings = await db
      .insert(schema.findings)
      .values(findingsToInsert)
      .returning()

    if (insertedFindings.length !== 3) {
      throw new Error('Failed to insert findings')
    }

    const result = await mergeDeduplicatedFindingsAction(request)

    const dbDeduplicatedFindings = await db.query.deduplicatedFindings.findMany(
      {
        with: {
          findings: true,
        },
        where: (deduplicatedFinding, {eq}) =>
          eq(deduplicatedFinding.id, bestDeduplicatedFindingId),
      },
    )

    expect(dbDeduplicatedFindings.length).toBe(1)
    expect(result).toEqual(dbDeduplicatedFindings[0])

    const dbFindings = await db.query.findings.findMany({
      columns: {deduplicatedFindingId: true},
      where: (finding, {eq}) =>
        eq(finding.deduplicatedFindingId, bestDeduplicatedFindingId),
    })

    expect(dbFindings).toEqual([
      {deduplicatedFindingId: bestDeduplicatedFindingId},
      {deduplicatedFindingId: bestDeduplicatedFindingId},
      {deduplicatedFindingId: bestDeduplicatedFindingId},
    ])
  })

  it('throws an error if the user is not a judge', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    await expect(mergeDeduplicatedFindingsAction(request)).rejects.toThrow(
      'Not authorized - JUDGE role is required.',
    )
  })

  it('throws an error if contest has not yet ended', async () => {
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
      .values({...contestToInsert, endDate: addDays(new Date(), 2)})
      .returning()

    if (insertedContest.length !== 1) {
      throw new Error('Failed to insert contest')
    }

    const insertedDeduplicatedFindings = await db
      .insert(schema.deduplicatedFindings)
      .values(deduplicatedFindingsToInsert)
      .returning()

    if (insertedDeduplicatedFindings.length !== 3) {
      throw new Error('Failed to insert deduplicated findings')
    }

    await expect(mergeDeduplicatedFindingsAction(request)).rejects.toThrow(
      'Deduplicated findings cannot be merged before the contest ends.',
    )
  })

  it('throws an error if findings are not in the same contest', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const differentContest = {
      id: uuidv4(),
      authorId: userId,
      title: 'Example Contest 2',
      description: 'This is an example contest 2.',
      repoUrl: 'https://github.com/example-contest-2',
      rewardsAmount: '1000',
      setupSteps: 'Step 1, Step 2, Step 3',
      status: ContestStatus.APPROVED,
      distributedRewardsAmount: '0',
      startDate: subDays(new Date(), 5),
      endDate: subDays(new Date(), 2),
    }

    const insertedContest = await db
      .insert(schema.contests)
      .values([contestToInsert, differentContest])
      .returning()

    if (insertedContest.length !== 2) {
      throw new Error('Failed to insert contest')
    }

    const newDeduplicatedFinding = {
      contestId: differentContest.id,
      id: uuidv4(),
      title: 'Deduplicated finding 4',
      description: 'Deduplicated finding 4 description',
      severity: FindingSeverity.CRITICAL,
    }

    const insertedDeduplicatedFindings = await db
      .insert(schema.deduplicatedFindings)
      .values([...deduplicatedFindingsToInsert, newDeduplicatedFinding])
      .returning()

    if (insertedDeduplicatedFindings.length !== 4) {
      throw new Error('Failed to insert deduplicated findings')
    }

    const newRequest: MergeDeduplicatedFindingsRequest = {
      bestDeduplicatedFindingId: request.bestDeduplicatedFindingId,
      deduplicatedFindingIds: [
        ...request.deduplicatedFindingIds,
        newDeduplicatedFinding.id,
      ],
    }

    await expect(mergeDeduplicatedFindingsAction(newRequest)).rejects.toThrow(
      'Deduplicated findings must be in the same contest.',
    )
  })
})
