import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {ContestStatus, UserRole} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {deleteContestAction} from '@/server/actions/contest/deleteContest'

const userId = uuidv4()

const contestToInsert: InsertContest = {
  authorId: userId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  repoBranch: 'main',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  status: ContestStatus.PENDING,
  distributedRewardsAmount: '0',
  startDate: addDays(new Date(), 1),
  endDate: addDays(new Date(), 2),
}

vi.mock('next-auth')

describe('deleteContest', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: userId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('deletes a contest successfully', async () => {
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
      .values([contestToInsert])
      .returning()

    if (insertedContests.length === 0 || !insertedContests[0]) {
      throw new Error('No contest created.')
    }

    const contestId = insertedContests[0].id

    const deletedContest = await deleteContestAction(contestId)

    const dbContest = await db.query.contests.findFirst({
      where: (contests, {eq}) => eq(contests.id, contestId),
    })

    expect(dbContest).toBeUndefined()
    expect(deletedContest).toEqual(insertedContests)
  })
})
