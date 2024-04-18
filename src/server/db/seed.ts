/* eslint-disable unicorn/no-process-exit */
import {faker} from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import {sql} from 'drizzle-orm'

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
  FindingStatus,
  InsertFinding,
  findings as findingsTable,
} from './schema/finding'
import {InsertReward, rewards as rewardsTable} from './schema/reward'

import {db} from './index'

const USERS_TO_GENERATE = 3 // minimum 2
const FINDINGS_PER_CONTEST = 10
const KNOWN_ISSUES_PER_CONTEST = 3

const TEST_PASSWORD = 'Passpass'

const hashedPassword = bcrypt.hashSync(TEST_PASSWORD, 10)
const walletAddress = env.SEED_WALLET_ADDRESS

const getUserToInsert = (): InsertUser => {
  const nameOptions = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }

  return {
    name: faker.person.fullName(nameOptions),
    alias: faker.helpers.unique(() => faker.internet.userName(nameOptions)),
    email: faker.internet.email(nameOptions),
    password: hashedPassword,
    image: faker.image.avatar(),
    walletAddress,
  }
}

const usersToInsert: InsertUser[] = [
  ...Array.from({length: USERS_TO_GENERATE}).map(getUserToInsert),
  {
    name: 'Admin',
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
  Array.from({length: KNOWN_ISSUES_PER_CONTEST}).map((_, index) => ({
    contestId: id,
    title: `Known issue #${index + 1}`,
    description: faker.lorem.paragraph(),
    fileUrl: faker.internet.url(),
  }))

const getFindingsToInsert = (
  contestId: string,
  auditorUserId: string,
): InsertFinding[] =>
  Array.from({length: FINDINGS_PER_CONTEST}).map((_, index) => ({
    authorId: auditorUserId,
    contestId,
    title: `Bug #${index + 1}`,
    description: faker.lorem.paragraph(),
    targetFileUrl: faker.internet.url(),
    severity: faker.helpers.enumValue(FindingSeverity),
    status: faker.helpers.enumValue(FindingStatus),
  }))

const getRewardToInsert = (finding: Finding): InsertReward => ({
  findingId: finding.id,
  userId: finding.authorId,
  amount: faker.finance.amount({
    min: 1_000_000,
    max: 5_000_000,
    dec: 0,
  }),
})

const seed = async () => {
  const schema = db._.schema

  await db.transaction(async (tx) => {
    if (schema) {
      const tableNames = Object.values(schema)
        .map((table) => `"${table.dbName}"`)
        .join(', ')

      await tx.execute(sql.raw(`truncate table ${tableNames};`))

      console.log('Truncated all DB tables')
    }

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

    const knownIssues = await tx
      .insert(knownIssuesTable)
      .values(contests.flatMap(getKnownIssuesToInsert))
      .returning()

    const pastContestFindings = await tx
      .insert(findingsTable)
      .values(getFindingsToInsert(pastContestId, auditorUserId))
      .returning()

    const currentContestFindings = await tx
      .insert(findingsTable)
      .values(getFindingsToInsert(currentContestId, auditorUserId))
      .returning()

    const rewardsToInsert = pastContestFindings.map(getRewardToInsert)

    const rewards = await tx
      .insert(rewardsTable)
      .values(rewardsToInsert)
      .returning()

    console.log(`Inserted ${users.length} users`)
    console.log(`Inserted ${contests.length} contests`)
    console.log(`Inserted ${knownIssues.length} known issues`)
    console.log(
      `Inserted ${pastContestFindings.length + currentContestFindings.length} findings`,
    )
    console.log(`Inserted ${rewards.length} rewards`)
  })

  process.exit()
}

void seed()
