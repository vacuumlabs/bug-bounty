import {describe, it, expect, vi, Mock, beforeEach} from 'vitest'
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
import {db, schema} from '@/server/db'
import {InsertUser} from '@/server/db/schema/user'
import {InsertContest} from '@/server/db/schema/contest'
import {
  EditContestRequest,
  editContestAction,
} from '@/server/actions/contest/editContest'
import {InsertContestSeverityWeights} from '@/server/db/schema/contestSeverityWeights'

const userId = uuidv4()

const contestToInsert: InsertContest = {
  authorId: userId,
  title: 'Example Contest',
  description: 'This is an example contest.',
  repoUrl: 'https://github.com/example-contest',
  repoBranch: 'main',
  rewardsAmount: '1000',
  customConditions: 'There are four custom conditions.',
  projectCategory: [ProjectCategory.DEFI, ProjectCategory.INFRASTRUCTURE],
  status: ContestStatus.PENDING,
  distributedRewardsAmount: '0',
  startDate: addDays(new Date(), 1),
  endDate: addDays(new Date(), 2),
}

vi.mock('next-auth')

describe('editContest', () => {
  beforeEach(async () => {
    vi.resetAllMocks()

    await trunacateDb()

    const user: InsertUser = {
      id: userId,
      email: 'user@example.com',
    }

    await db.insert(schema.users).values([user])
  })

  it('edits a contest successfully', async () => {
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

    const severityWeightsToInsert: InsertContestSeverityWeights = {
      contestId,
      info: 1,
      low: 2,
      medium: 3,
      high: 4,
      critical: 5,
    }

    const insertedSeverityWeights = await db
      .insert(schema.contestSeverityWeights)
      .values([severityWeightsToInsert])
      .returning()

    if (insertedSeverityWeights.length === 0 || !insertedSeverityWeights[0]) {
      throw new Error('No severity weights created.')
    }

    const editContestRequest: EditContestRequest = {
      contest: {
        id: contestId,
        title: 'Edited Contest',
        description: 'This is an edited contest.',
        repoUrl: 'https://github.com/edited-contest',
        customConditions: 'Edited setup steps',
        projectCategory: [ProjectCategory.NFT],
        projectLanguage: [ProjectLanguage.AIKEN],
      },
      customWeights: {
        info: 2,
        low: 3,
        medium: 4,
        high: 5,
        critical: 6,
      },
    }

    const result = await editContestAction(editContestRequest)

    const dbContest = await db.query.contests.findFirst({
      with: {contestSeverityWeights: true},
      where: (contests, {eq}) => eq(contests.id, contestId),
    })

    if (!dbContest) {
      throw new Error('Contest not found.')
    }

    const {contestSeverityWeights, ...rest} = dbContest

    expect(result).toEqual([{...rest, ...editContestRequest.contest}])
    expect(contestSeverityWeights).toEqual({
      ...editContestRequest.customWeights,
      id: contestSeverityWeights?.id,
      contestId: contestSeverityWeights?.contestId,
      updatedAt: contestSeverityWeights?.updatedAt,
      createdAt: contestSeverityWeights?.createdAt,
    })
  })
})
