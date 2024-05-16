import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {ContestStatus, UserRole} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {getPublicContests} from '@/server/actions/contest/getContests'

const userId = uuidv4()

const contestsToInsert: InsertContest[] = [
  {
    authorId: userId,
    title: 'Example Contest',
    description: 'This is an example contest.',
    repoUrl: 'https://github.com/example-contest',
    rewardsAmount: '1000',
    setupSteps: 'Step 1, Step 2, Step 3',
    status: ContestStatus.APPROVED,
    distributedRewardsAmount: '0',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
  },
  {
    authorId: userId,
    title: 'Example Contest 2',
    description: 'This is an example contest 2.',
    repoUrl: 'https://github.com/example-contest-2',
    rewardsAmount: '1002',
    setupSteps: 'Step 1, Step 2, Step 3',
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
    rewardsAmount: '1003',
    setupSteps: 'Step 1, Step 2, Step 3',
    status: ContestStatus.PENDING,
    distributedRewardsAmount: '0',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
  },
  {
    authorId: userId,
    title: 'Example Contest 4',
    description: 'This is an example contest 4.',
    repoUrl: 'https://github.com/example-contest-4',
    rewardsAmount: '1004',
    setupSteps: 'Step 1, Step 2, Step 3',
    status: ContestStatus.REJECTED,
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