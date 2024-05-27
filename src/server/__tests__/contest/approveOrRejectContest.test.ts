import {Mock, beforeEach, describe, expect, it, vi} from 'vitest'
import {addDays} from 'date-fns'
import {getServerSession} from 'next-auth'
import {v4 as uuidv4} from 'uuid'

import {trunacateDb} from '../utils/db'

import {
  ContestStatus,
  ProjectCategory,
  ProjectLanguage,
  UserRole,
} from '@/server/db/models'
import {InsertUser} from '@/server/db/schema/user'
import {db, schema} from '@/server/db'
import {InsertContest} from '@/server/db/schema/contest'
import {
  ApproveOrRejectContestRequest,
  approveOrRejectContestAction,
} from '@/server/actions/contest/approveOrRejectContest'

const authorId = uuidv4()

const contestRequest: InsertContest = {
  authorId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  repoBranch: 'main',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
  projectLanguage: [ProjectLanguage.AIKEN],
  status: ContestStatus.PENDING,
  distributedRewardsAmount: '0',
  startDate: addDays(new Date(), 1),
  endDate: addDays(new Date(), 2),
}

vi.mock('next-auth')

describe('approveOrRejectContest', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: authorId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('throws an error if the user is not a judge', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: authorId,
        provider: 'github',
        role: UserRole.AUDITOR,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const randomContestId = uuidv4()

    const approveRequest: ApproveOrRejectContestRequest = {
      contestId: randomContestId,
      newStatus: ContestStatus.APPROVED,
    }

    await expect(async () => {
      await approveOrRejectContestAction(approveRequest)
    }).rejects.toThrowError('Not authorized - JUDGE role is required.')
  })

  it('throws an error if the contest is not PENDING', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: authorId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const contest = await db
      .insert(schema.contests)
      .values([{...contestRequest, status: ContestStatus.DRAFT}])
      .returning()

    if (contest.length === 0 || !contest[0]?.id) {
      throw new Error('Contest not found.')
    }

    const approveRequest: ApproveOrRejectContestRequest = {
      contestId: contest[0].id,
      newStatus: ContestStatus.APPROVED,
    }

    await expect(async () => {
      await approveOrRejectContestAction(approveRequest)
    }).rejects.toThrowError(
      'Only pending and in review contests can be approved/rejected.',
    )
  })

  it('approves a contest successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: authorId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const contest = await db
      .insert(schema.contests)
      .values([contestRequest])
      .returning()

    if (contest.length === 0 || !contest[0]?.id) {
      throw new Error('Contest not found.')
    }

    const approveRequest: ApproveOrRejectContestRequest = {
      contestId: contest[0].id,
      newStatus: ContestStatus.APPROVED,
    }

    const result = await approveOrRejectContestAction(approveRequest)
    const approvedContest = result[0]

    if (!approvedContest) {
      throw new Error('Approved contest not found.')
    }

    const dbData = await db.query.contests.findFirst({
      where: (contests, {eq}) => eq(contests.id, approvedContest.id),
    })

    expect(approvedContest).toEqual(dbData)
    expect(dbData?.status).toEqual(ContestStatus.APPROVED)
  })

  it('rejects a contest successfully', async () => {
    ;(getServerSession as Mock).mockResolvedValue({
      user: {
        id: authorId,
        provider: 'github',
        role: UserRole.JUDGE,
      },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    })

    const contest = await db
      .insert(schema.contests)
      .values([contestRequest])
      .returning()

    if (contest.length === 0 || !contest[0]?.id) {
      throw new Error('Contest not found.')
    }

    const rejectRequest: ApproveOrRejectContestRequest = {
      contestId: contest[0].id,
      newStatus: ContestStatus.REJECTED,
    }

    const result = await approveOrRejectContestAction(rejectRequest)
    const rejectedContest = result[0]

    if (!rejectedContest) {
      throw new Error('Rejected contest not found.')
    }

    const dbData = await db.query.contests.findFirst({
      where: (contests, {eq}) => eq(contests.id, rejectedContest.id),
    })

    expect(rejectedContest).toEqual(dbData)
    expect(dbData?.status).toEqual(ContestStatus.REJECTED)
  })
})
