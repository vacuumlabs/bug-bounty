/* eslint-disable unicorn/no-process-exit */
import {faker} from '@faker-js/faker'
import bcrypt from 'bcryptjs'

import {InsertUser, UserRole, users as usersTable} from './schema/user'
import {env} from '../../env.js'
import {
  Contest,
  ContestStatus,
  InsertContest,
  InsertKnownIssue,
  contests as contestsTable,
  knownIssues as knownIssuesTable,
} from './schema/contest'
import {
  Finding,
  FindingSeverity,
  InsertFinding,
  findings as findingsTable,
} from './schema/finding'
import {InsertReward, rewards as rewardsTable} from './schema/reward'

import {db} from './index'

const TEST_PASSWORD = 'Passpass'

const hashedPassword = bcrypt.hashSync(TEST_PASSWORD, 10)
const walletAddress = env.SEED_WALLET_ADDRESS

const usersToInsert: InsertUser[] = [
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    image: faker.image.avatar(),
    walletAddress,
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    image: faker.image.avatar(),
    walletAddress,
  },
  {
    name: faker.person.fullName(),
    email: 'admin@test.com',
    password: hashedPassword,
    image: faker.image.avatar(),
    walletAddress,
    role: UserRole.JUDGE,
  },
]

const getContestsToInsert = (projectOwnerUserId: string): InsertContest[] => [
  {
    authorId: projectOwnerUserId,
    title: faker.company.name(),
    description: faker.lorem.paragraph(),
    repoUrl: faker.internet.url(),
    setupSteps: faker.lorem.sentence(),
    startDate: faker.date.past(),
    endDate: faker.date.recent(),
    status: ContestStatus.APPROVED,
  },
  {
    authorId: projectOwnerUserId,
    title: faker.company.name(),
    description: faker.lorem.paragraph(),
    repoUrl: faker.internet.url(),
    setupSteps: faker.lorem.sentence(),
    startDate: faker.date.recent(),
    endDate: faker.date.soon(),
    status: ContestStatus.APPROVED,
  },
  {
    authorId: projectOwnerUserId,
    title: faker.company.name(),
    description: faker.lorem.paragraph(),
    repoUrl: faker.internet.url(),
    setupSteps: faker.lorem.sentence(),
    startDate: faker.date.soon(),
    endDate: faker.date.future(),
    status: ContestStatus.APPROVED,
  },
  {
    authorId: projectOwnerUserId,
    title: faker.company.name(),
    description: faker.lorem.paragraph(),
    repoUrl: faker.internet.url(),
    setupSteps: faker.lorem.sentence(),
    startDate: faker.date.soon(),
    endDate: faker.date.future(),
    status: ContestStatus.PENDING,
  },
]

const getKnownIssuesToInsert = ({id}: Contest): InsertKnownIssue[] =>
  Array.from({length: 3}).map((_, index) => ({
    contestId: id,
    title: `Known issue #${index + 1}`,
    description: faker.lorem.paragraph(),
    fileUrl: faker.internet.url(),
  }))

const getFindingsToInsert = (
  contestId: string,
  auditorUserId: string,
): InsertFinding[] =>
  Array.from({length: 10}).map((_, index) => ({
    authorId: auditorUserId,
    contestId,
    title: `Bug #${index + 1}`,
    description: faker.lorem.paragraph(),
    targetFileUrl: faker.internet.url(),
    severity: faker.helpers.enumValue(FindingSeverity),
  }))

const getRewardToInsert = (finding: Finding): InsertReward => ({
  findingId: finding.id,
  userId: finding.authorId,
  amount: faker.finance.amount({
    min: 10_000,
    max: 1_000_000,
    dec: 0,
  }),
})

const seed = async () => {
  await db.transaction(async (tx) => {
    const users = await tx.insert(usersTable).values(usersToInsert).returning()

    const projectOwnerUserId = users[0]?.id
    const auditorUserId = users[1]?.id

    if (!projectOwnerUserId || !auditorUserId) {
      throw new Error('Failed to generate users')
    }

    const contests = await tx
      .insert(contestsTable)
      .values(getContestsToInsert(projectOwnerUserId))
      .returning()

    const pastContestId = contests[0]?.id
    const currentContestId = contests[1]?.id

    if (!pastContestId || !currentContestId) {
      throw new Error('Failed to generate contests')
    }

    await tx
      .insert(knownIssuesTable)
      .values(contests.flatMap(getKnownIssuesToInsert))

    const pastContestFindings = await tx
      .insert(findingsTable)
      .values(getFindingsToInsert(pastContestId, auditorUserId))
      .returning()

    await tx
      .insert(findingsTable)
      .values(getFindingsToInsert(currentContestId, auditorUserId))

    const rewardsToInsert = pastContestFindings.map(getRewardToInsert)

    await tx.insert(rewardsTable).values(rewardsToInsert)
  })

  process.exit()
}

void seed()
