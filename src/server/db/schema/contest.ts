import type {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {
  char,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'

import {findings} from './finding'
import {users} from './user'
import {knownIssues} from './knownIssue'
import {deduplicatedFindings} from './deduplicatedFinding'
import {ContestStatus, ProjectCategory, ProjectLanguage} from '../models/enums'
import {contestSeverityWeights} from './contestSeverityWeights'

import {getDrizzleEnum} from '@/server/utils/enum'

export const contests = pgTable(
  'contest',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('authorId')
      .notNull()
      .references(() => users.id),
    title: varchar('name', {length: 255}).notNull(),
    repoUrl: varchar('repoUrl', {length: 255}).notNull(),
    repoBranch: varchar('repoBranch', {length: 255}).notNull(),
    filesInScope: varchar('filesInScope', {length: 255}).array().notNull(),
    description: text('description').notNull(),
    customConditions: text('customConditions'),
    projectLanguage: varchar('projectLanguage', {
      length: 32,
      enum: getDrizzleEnum(ProjectLanguage),
    }).array(),
    projectCategory: varchar('projectCategory', {
      length: 32,
      enum: getDrizzleEnum(ProjectCategory),
    }).array(),
    rewardsAmount: numeric('rewardsAmount', {
      precision: 20,
      scale: 0,
    }).notNull(),
    rewardsTransferTxHash: char('rewardsTransferTxHash', {length: 64}),
    distributedRewardsAmount: numeric('distributedRewardsAmount', {
      precision: 20,
      scale: 0,
    }),
    knownIssuesDescription: text('knownIssuesDescription'),
    startDate: timestamp('startDate', {
      mode: 'date',
    }).notNull(),
    endDate: timestamp('endDate', {
      mode: 'date',
    }).notNull(),
    status: varchar('status', {
      length: 32,
      enum: getDrizzleEnum(ContestStatus),
    }).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    authorIdIdx: index('contest_authordId_idx').on(table.authorId),
    statusIdx: index('contest_status_idx').on(table.status),
    startDateIdx: index('contest_startDate_idx').on(table.startDate),
    endDateIdx: index('contest_endDate_idx').on(table.endDate),
  }),
)

export const contestRelations = relations(contests, ({one, many}) => ({
  findings: many(findings),
  deduplicatedFindings: many(deduplicatedFindings),
  author: one(users, {
    fields: [contests.authorId],
    references: [users.id],
  }),
  knownIssues: many(knownIssues),
  contestSeverityWeights: one(contestSeverityWeights),
}))

export const insertContestSchema = createInsertSchema(contests, {
  repoUrl: (schema) => schema.repoUrl.url('Invalid repository URL.'),
  title: (schema) => schema.title.min(1, 'Title must be at least 1 character.'),
  repoBranch: (schema) =>
    schema.repoBranch.min(1, 'Branch must be at least 1 character.'),
  rewardsAmount: (schema) => schema.rewardsAmount.min(1, 'Required'),
  description: (schema) =>
    schema.description.min(1, 'Description can’t be empty.'),
  filesInScope: (schema) =>
    schema.filesInScope.min(1, 'Must have at least 1 file in scope.'),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectContestSchema = createSelectSchema(contests)

export type InsertContest = z.infer<typeof insertContestSchema>
export type Contest = z.infer<typeof selectContestSchema>
