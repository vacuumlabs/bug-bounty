import type {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {pgTable, text, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'

import {deduplicatedFindings, findings} from './finding'

export const CONTEST_STATUS = ['approved', 'pending', 'rejected'] as const
export type ContestStatus = (typeof CONTEST_STATUS)[number]

export const contests = pgTable('contest', {
  id: uuid('id').defaultRandom().primaryKey(),
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
  status: varchar('status', {length: 8, enum: CONTEST_STATUS}).notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
})

const insertContestsSchema = createInsertSchema(contests)
const selectContestsSchema = createSelectSchema(contests)
export type InsertContest = z.infer<typeof insertContestsSchema>
export type Contest = z.infer<typeof selectContestsSchema>

export const contestRelations = relations(contests, ({many}) => ({
  findings: many(findings),
  deduplicatedFindings: many(deduplicatedFindings),
}))
