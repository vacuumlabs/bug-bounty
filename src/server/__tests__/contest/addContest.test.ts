import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'
import {expectAnyDate, expectAnyString} from '../utils/expect'

import {
  AddContestRequest,
  addContestAction,
} from '@/server/actions/contest/addContest'
import {
  ContestStatus,
  ProjectCategory,
  ProjectLanguage,
  UserRole,
} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'

const userId = uuidv4()

const request: AddContestRequest = {
  contest: {
    title: 'Example Contest',
    description: 'This is an example contest.',
    repoUrl: 'https://github.com/example-contest',
    rewardsAmount: '1000',
    customConditions: 'There are four custom conditions.',
    projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
    projectLanguage: [ProjectLanguage.AIKEN],
    status: ContestStatus.PENDING,
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 2),
  },
  severityWeights: {
    info: 1,
    low: 2,
    medium: 3,
    high: 4,
    critical: 5,
  },
}

vi.mock('next-auth')

describe('addContest', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: userId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('throws an error if the user is a judge', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    await expect(addContestAction(request)).rejects.toThrow(
      "Judges can't create contests.",
    )
  })

  it('creates a contest successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const result = await addContestAction(request)
    const addedContest = result[0]

    if (!addedContest) {
      throw new Error('Contest not added in test.')
    }

    const dbContest = await db.query.contests.findFirst({
      where: (contests, {eq}) => eq(contests.id, addedContest.id),
    })

    if (!dbContest) {
      throw new Error('Contest not found in the database.')
    }

    const dbCustomWeights = await db.query.contestSeverityWeights.findFirst({
      where: (contestSeverityWeights, {eq}) =>
        eq(contestSeverityWeights.contestId, dbContest.id),
    })

    expect(result).toEqual([dbContest])

    expect(dbCustomWeights).toMatchObject({
      id: expectAnyString,
      updatedAt: expectAnyDate,
      createdAt: expectAnyDate,
      contestId: dbContest.id,
      ...request.severityWeights,
    })
  })
})
