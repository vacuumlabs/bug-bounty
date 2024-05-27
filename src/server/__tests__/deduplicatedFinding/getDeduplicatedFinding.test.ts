import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {ContestStatus, FindingSeverity, UserRole} from '@/server/db/models'
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {InsertDeduplicatedFinding} from '@/server/db/schema/deduplicatedFinding'
import {getDeduplicatedFindings} from '@/server/actions/deduplicatedFinding/getDeduplicatedFinding'

const userId = uuidv4()
const contestId = uuidv4()

const contestsToInsert: InsertContest = {
  id: contestId,
  authorId: userId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  repoBranch: 'main',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  status: ContestStatus.APPROVED,
  distributedRewardsAmount: '0',
  startDate: addDays(new Date(), 1),
  endDate: addDays(new Date(), 2),
}

const deduplicatedFindingsToInsert: InsertDeduplicatedFinding[] = [
  {
    contestId,
    title: 'Deduplicated finding 1',
    description: 'Deduplicated finding 1 description',
    severity: FindingSeverity.HIGH,
  },
  {
    contestId,
    title: 'Deduplicated finding 2',
    description: 'Deduplicated finding 2 description',
    severity: FindingSeverity.MEDIUM,
  },
  {
    contestId,
    title: 'Deduplicated finding 3',
    description: 'Deduplicated finding 3 description',
    severity: FindingSeverity.INFO,
  },
]

vi.mock('next-auth')

describe('getDeduplicatedFinding', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: userId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('gets a deduplicated finding successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: userId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const insertedContest = await db
      .insert(schema.contests)
      .values(contestsToInsert)
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

    const result = await getDeduplicatedFindings({contestId})

    expect(result).toEqual(insertedDeduplicatedFindings)
  })
})
