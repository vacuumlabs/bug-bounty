/* eslint-disable unicorn/no-process-exit */
import {faker} from '@faker-js/faker'
import bcrypt from 'bcryptjs'
import {sql} from 'drizzle-orm'

import {InsertUser} from './schema/user'
import {env} from '../../env.js'
import {Contest, InsertContest} from './schema/contest'
import {Finding, InsertFinding} from './schema/finding'
import {InsertReward} from './schema/reward'
import {InsertKnownIssue} from './schema/knownIssue'
import {
  ContestStatus,
  FindingSeverity,
  FindingStatus,
  ProjectCategory,
  ProjectLanguage,
  UserRole,
} from './models/enums'
import {TEST_WALLET_ADDRESS} from '../utils/test'

import {db, schema} from './index'

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

const getBasicContestData = (projectOwnerUserId: string) => ({
  authorId: projectOwnerUserId,
  title: faker.company.name(),
  description: faker.lorem.paragraphs(),
  repoUrl: faker.internet.url(),
  repoBranch: 'main',
  filesInScope: faker.helpers.multiple(() => faker.internet.url()),
  projectCategory: faker.helpers.uniqueArray(
    () => faker.helpers.enumValue(ProjectCategory),
    2,
  ),
  projectLanguage: [faker.helpers.enumValue(ProjectLanguage)],
  customConditions: faker.lorem.sentence(),
  rewardsAmount: faker.finance.amount({
    min: 100_000_000,
    max: 1_000_000_000,
    dec: 0,
  }),
})

const getContestsToInsert = (projectOwnerUserId: string): InsertContest[] => [
  {
    ...getBasicContestData(projectOwnerUserId),
    startDate: faker.date.past(),
    endDate: faker.date.recent(),
    status: ContestStatus.APPROVED,
  },
  {
    ...getBasicContestData(projectOwnerUserId),
    startDate: faker.date.recent(),
    endDate: faker.date.soon(),
    status: ContestStatus.APPROVED,
  },
  {
    ...getBasicContestData(projectOwnerUserId),
    startDate: faker.date.soon(),
    endDate: faker.date.future(),
    status: ContestStatus.APPROVED,
  },
  {
    ...getBasicContestData(projectOwnerUserId),
    startDate: faker.date.soon(),
    endDate: faker.date.future(),
    status: ContestStatus.IN_REVIEW,
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
    rewardWalletAddress: TEST_WALLET_ADDRESS,
    contestId,
    title: `Bug #${index + 1}`,
    description: faker.lorem.paragraph(),
    affectedFiles: faker.helpers.multiple(() => faker.internet.url()),
    proofOfConcept: faker.helpers.maybe(() => faker.lorem.paragraph()),
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
  const dbSchema = db._.schema

  await db.transaction(async (tx) => {
    if (dbSchema) {
      const tableNames = Object.values(dbSchema)
        .map((table) => `"${table.dbName}"`)
        .join(', ')

      await tx.execute(sql.raw(`truncate table ${tableNames};`))

      console.log('Truncated all DB tables')
    }

    const users = await tx
      .insert(schema.users)
      .values(usersToInsert)
      .returning()

    const projectOwnerUserId = users[0]?.id
    const auditorUserId = users[1]?.id

    if (!projectOwnerUserId || !auditorUserId) {
      throw new Error('Failed to generate users')
    }

    const contestToInsert = Array.from({length: 5}).flatMap(() =>
      getContestsToInsert(projectOwnerUserId),
    )

    const contests = await tx
      .insert(schema.contests)
      .values(contestToInsert)
      .returning()

    const pastContestId = contests[0]?.id
    const currentContestId = contests[1]?.id

    if (!pastContestId || !currentContestId) {
      throw new Error('Failed to generate contests')
    }

    const knownIssues = await tx
      .insert(schema.knownIssues)
      .values(contests.flatMap(getKnownIssuesToInsert))
      .returning()

    const pastContestFindings = await tx
      .insert(schema.findings)
      .values(getFindingsToInsert(pastContestId, auditorUserId))
      .returning()

    const currentContestFindings = await tx
      .insert(schema.findings)
      .values(getFindingsToInsert(currentContestId, auditorUserId))
      .returning()

    const rewardsToInsert = pastContestFindings.map(getRewardToInsert)

    const rewards = await tx
      .insert(schema.rewards)
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
