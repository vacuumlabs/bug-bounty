import type {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {pgTable, text, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'

import {deduplicatedFindings, findings} from './finding'
import {users} from './user'
import {getDrizzleEnum} from '../utils/enum'

export enum ContestStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export const contests = pgTable('contest', {
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
})

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
}))
