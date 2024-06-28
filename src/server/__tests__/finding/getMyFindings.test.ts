import {describe, it, vi, Mock, beforeEach, expect} from 'vitest'
import {addDays, subDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'
import {faker} from '@faker-js/faker'

import {trunacateDb} from '../utils/db'
import {expectAnyDate, expectAnyString} from '../utils/expect'

import {
  ContestStatus,
  FindingOccurence,
  FindingSeverity,
  FindingStatus,
  ProjectCategory,
  UserRole,
} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {InsertFinding} from '@/server/db/schema/finding'
import {
  MyFinding,
  getMyFindingsAction,
} from '@/server/actions/finding/getMyFinding'
import {TEST_WALLET_ADDRESS} from '@/server/utils/test'

const userId = uuidv4()
const contestId1 = uuidv4()
const contestAuthorId1 = uuidv4()
const contestId2 = uuidv4()
const contestAuthorId2 = uuidv4()

const contestsToInsert: InsertContest[] = [
  {
    id: contestId1,
    authorId: contestAuthorId1,
    title: 'Example Contest',
    description: 'This is an example contest.',
    repoUrl: 'https://github.com/example-contest',
    repoBranch: 'main',
    rewardsAmount: '1000',
    customConditions: 'There are four custom conditions.',
    filesInScope: faker.helpers.multiple(() => faker.internet.url()),
    projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
    status: ContestStatus.PENDING,
    distributedRewardsAmount: '0',
    startDate: subDays(new Date(), 2),
    endDate: subDays(new Date(), 1),
  },
  {
    id: contestId2,
    authorId: contestAuthorId2,
    title: 'Example Contest 2',
    description: 'This is an example contest 2.',
    repoUrl: 'https://github.com/example-contest-2',
    repoBranch: 'main',
    rewardsAmount: '2000',
    customConditions: 'There are four custom conditions.',
    filesInScope: faker.helpers.multiple(() => faker.internet.url()),
    projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
    status: ContestStatus.PENDING,
    distributedRewardsAmount: '0',
    startDate: subDays(new Date(), 2),
    endDate: addDays(new Date(), 2),
  },
]

const findingsToInsert: InsertFinding[] = [
  {
    contestId: contestId1,
    authorId: userId,
    description: 'This is a finding description.',
    title: 'Finding title',
    severity: FindingSeverity.HIGH,
    status: FindingStatus.PENDING,
    affectedFiles: ['https://github.com/example-contest/file.js'],
    rewardWalletAddress: TEST_WALLET_ADDRESS,
    deduplicatedFindingId: null,
  },
  {
    contestId: contestId2,
    authorId: userId,
    description: 'This is a finding 2 description.',
    title: 'Finding 2 title',
    severity: FindingSeverity.LOW,
    status: FindingStatus.PENDING,
    affectedFiles: ['https://github.com/example-contest/file.js'],
    rewardWalletAddress: TEST_WALLET_ADDRESS,
    deduplicatedFindingId: null,
  },
]

vi.mock('next-auth')

describe('getMyFindings', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const users: InsertUser[] = [
      {
        id: userId,
        email: 'user@example.com',
      },
      {
        id: contestAuthorId1,
        email: 'contestAuthor@example.com',
      },
      {
        id: contestAuthorId2,
        email: 'contestAuthor2@example.com',
      },
    ]

    await db.insert(schema.users).values(users)
  })

  it('gets a users findings successfully', async () => {
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
      .values(contestsToInsert)
      .returning()

    if (
      insertedContests.length === 0 ||
      !insertedContests[0] ||
      !insertedContests[1]
    ) {
      throw new Error('No contest created.')
    }

    const pastContest = insertedContests[0]
    const liveContest = insertedContests[1]

    const insertedFindings = await db
      .insert(schema.findings)
      .values(findingsToInsert)
      .returning()

    if (
      insertedFindings.length === 0 ||
      !insertedFindings[0] ||
      !insertedFindings[1]
    ) {
      throw new Error('Finding not found.')
    }

    const pastFinding = insertedFindings[0]
    const liveFinding = insertedFindings[1]

    const myFindingsRequestPast = await getMyFindingsAction({
      type: FindingOccurence.PAST,
    })

    const expectedPastFinding: MyFinding = {
      ...pastFinding,
      id: expectAnyString,
      deduplicatedFindingId: null,
      createdAt: expectAnyDate,
      updatedAt: expectAnyDate,
      contest: {
        endDate: pastContest.endDate,
        startDate: pastContest.startDate,
        status: pastContest.status,
        title: pastContest.title,
      },
    }

    expect(myFindingsRequestPast).toEqual([expectedPastFinding])

    const myFindingsRequestPresent = await getMyFindingsAction({
      type: FindingOccurence.PRESENT,
    })

    const expectedPresentFinding: MyFinding = {
      ...liveFinding,
      id: expectAnyString,
      deduplicatedFindingId: null,
      createdAt: expectAnyDate,
      updatedAt: expectAnyDate,
      contest: {
        endDate: liveContest.endDate,
        startDate: liveContest.startDate,
        status: liveContest.status,
        title: liveContest.title,
      },
    }

    expect(myFindingsRequestPresent).toEqual([expectedPresentFinding])

    const myFindingsRequestAll = await getMyFindingsAction({})

    expect(myFindingsRequestAll).toEqual([
      expectedPastFinding,
      expectedPresentFinding,
    ])
  })
})
