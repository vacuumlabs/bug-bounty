import type {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'

import {deduplicatedFindings, findings} from './finding'
import {users} from './user'

import {getDrizzleEnum} from '@/server/utils/enum'

export enum ContestStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export const contests = pgTable(
  'contest',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('authorId')
      .notNull()
      .references(() => users.id),
    title: varchar('name', {length: 255}).notNull(),
    repoUrl: varchar('repoUrl', {length: 255}).notNull(),
    description: text('description').notNull(),
    setupSteps: text('setupSteps').notNull(),
    startDate: timestamp('startDate', {
      mode: 'date',
    }).notNull(),
    endDate: timestamp('endDate', {
      mode: 'date',
    }).notNull(),
    status: varchar('status', {
      length: 8,
      enum: getDrizzleEnum(ContestStatus),
    }).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    authorIdIdx: index('contest_authordId_idx').on(table.authorId),
    statusIdx: index('contest_status_idx').on(table.status),
    startDateIdx: index('contest_startDate_idx').on(table.startDate),
    endDateIdx: index('contest_endDate_idx').on(table.endDate),
  }),
)

const insertContestsSchema = createInsertSchema(contests)
const selectContestsSchema = createSelectSchema(contests)
export type InsertContest = z.infer<typeof insertContestsSchema>
export type Contest = z.infer<typeof selectContestsSchema>

export const contestRelations = relations(contests, ({one, many}) => ({
  findings: many(findings),
  deduplicatedFindings: many(deduplicatedFindings),
  author: one(users, {
    fields: [contests.authorId],
    references: [users.id],
  }),
  knownIssues: many(knownIssues),
}))

export const knownIssues = pgTable(
  'knownIssue',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contestId: uuid('contestId')
      .notNull()
      .references(() => contests.id),
    title: varchar('title', {length: 255}).notNull(),
    description: text('description').notNull(),
    fileUrl: varchar('fileUrl', {length: 255}).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    contestIdIdx: index('knownIssue_contestId_idx').on(table.contestId),
  }),
)

const insertKnownIssuesSchema = createInsertSchema(knownIssues)
const selectKnownIssuesSchema = createSelectSchema(knownIssues)
export type InsertKnownIssue = z.infer<typeof insertKnownIssuesSchema>
export type KnownIssue = z.infer<typeof selectKnownIssuesSchema>

export const knownIssueRelations = relations(knownIssues, ({one}) => ({
  contest: one(contests, {
    fields: [knownIssues.contestId],
    references: [contests.id],
  }),
}))
