import {Mock, beforeEach, describe, expect, it, vi} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {ContestStatus, UserRole} from '@/server/db/models'
import {InsertUser} from '@/server/db/schema/user'
import {db, schema} from '@/server/db'
import {InsertContest} from '@/server/db/schema/contest'
import {
  AddKnownIssuesRequest,
  addKnownIssuesAction,
} from '@/server/actions/contest/addKnownIssues'

const authorId = uuidv4()

const contesToInsert: InsertContest = {
  authorId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  rewardsAmount: '1000',
  setupSteps: 'Step 1, Step 2, Step 3',
  status: ContestStatus.PENDING,
  distributedRewardsAmount: '0',
  startDate: addDays(new Date(), 1),
  endDate: addDays(new Date(), 2),
}

vi.mock('next-auth')

describe('addKnownIssues', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: authorId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('creates known issues for a contest successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: authorId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const contest = await db
      .insert(schema.contests)
      .values([contesToInsert])
      .returning()

    if (contest.length === 0 || !contest[0]?.id) {
      throw new Error('Contest not found.')
    }

    const knownIssues: AddKnownIssuesRequest = {
      contestId: contest[0].id,
      knownIssues: [
        {
          title: 'Example Known Issue',
          description: 'This is an example known issue.',
          fileUrl: 'https://example.com/known-issue.pdf',
        },
      ],
    }

    const result = await addKnownIssuesAction(knownIssues)

    expect(result).toEqual([
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: expect.any(String),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        createdAt: expect.any(Date),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updatedAt: expect.any(Date),
        contestId: contest[0].id,
        title: 'Example Known Issue',
        description: 'This is an example known issue.',
        fileUrl: 'https://example.com/known-issue.pdf',
      },
    ])
  })
})
