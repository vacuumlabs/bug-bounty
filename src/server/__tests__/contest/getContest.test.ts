import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'
import {faker} from '@faker-js/faker'

import {trunacateDb} from '../utils/db'

import {
  ContestStatus,
  ProjectCategory,
  ProjectLanguage,
  UserRole,
} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {getPublicContests} from '@/server/actions/contest/getPublicContests'

const userId = uuidv4()

const contestsToInsert: InsertContest[] = [
  {
    authorId: userId,
    title: 'Example Contest',
    description: 'This is an example contest.',
    repoUrl: 'https://github.com/example-contest',
    repoBranch: 'main',
    rewardsAmount: '1000',
    customConditions: 'There are four custom conditions.',
    filesInScope: faker.helpers.multiple(() => faker.internet.url()),
    status: ContestStatus.APPROVED,
    projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
    projectLanguage: [ProjectLanguage.AIKEN],
    distributedRewardsAmount: '0',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
  },
  {
    authorId: userId,
    title: 'Example Contest 2',
    description: 'This is an example contest 2.',
    repoUrl: 'https://github.com/example-contest-2',
    repoBranch: 'main',
    rewardsAmount: '1002',
    customConditions: 'There are four custom conditions.',
    filesInScope: faker.helpers.multiple(() => faker.internet.url()),
    status: ContestStatus.FINISHED,
    distributedRewardsAmount: '0',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
  },
  {
    authorId: userId,
    title: 'Example Contest 3',
    description: 'This is an example contest 3.',
    repoUrl: 'https://github.com/example-contest-3',
    repoBranch: 'main',
    rewardsAmount: '1003',
    customConditions: 'There are four custom conditions.',
    filesInScope: faker.helpers.multiple(() => faker.internet.url()),
    status: ContestStatus.PENDING,
    projectCategory: [],
    projectLanguage: [],
    distributedRewardsAmount: '0',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
  },
  {
    authorId: userId,
    title: 'Example Contest 4',
    description: 'This is an example contest 4.',
    repoUrl: 'https://github.com/example-contest-4',
    repoBranch: 'main',
    rewardsAmount: '1004',
    customConditions: 'There are four custom conditions.',
    filesInScope: faker.helpers.multiple(() => faker.internet.url()),
    status: ContestStatus.REJECTED,
    projectCategory: [ProjectCategory.OTHER],
    projectLanguage: [ProjectLanguage.OTHER],
    distributedRewardsAmount: '0',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
  },
]

vi.mock('next-auth')

describe('getContest', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: userId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('gets a contest successfully', async () => {
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

    const getContestResult = await getPublicContests({})

    const dbContest = await db.query.contests.findMany({
      where: (contests, {inArray}) =>
        inArray(contests.status, [
          ContestStatus.APPROVED,
          ContestStatus.FINISHED,
        ]),
    })

    expect(getContestResult).toEqual(
      insertedContests.filter(
        (contest) =>
          contest.status === ContestStatus.APPROVED ||
          contest.status === ContestStatus.FINISHED,
      ),
    )
    expect(getContestResult).toEqual(dbContest)
  })
})
