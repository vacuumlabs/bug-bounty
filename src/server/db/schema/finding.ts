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

import {contests} from './contest'
import {users} from './user'
import {rewards} from './reward'
import {deduplicatedFindings} from './deduplicatedFinding'
import {findingAttachments} from './findingAttachment'
import {FindingSeverity, FindingStatus} from '../models/enums'

import {getDrizzleEnum} from '@/server/utils/enum'

export const findings = pgTable(
  'finding',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorId: uuid('authorId')
      .notNull()
      .references(() => users.id),
    contestId: uuid('contestId')
      .notNull()
      .references(() => contests.id),
    deduplicatedFindingId: uuid('deduplicatedFindingId').references(
      () => deduplicatedFindings.id,
    ),
    title: varchar('name', {length: 255}).notNull(),
    description: text('description').notNull(),
    targetFileUrl: varchar('targetFileUrl', {length: 255}).notNull(),
    severity: varchar('severity', {
      length: 8,
      enum: getDrizzleEnum(FindingSeverity),
    }).notNull(),
    status: varchar('status', {
      length: 8,
      enum: getDrizzleEnum(FindingStatus),
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
    authorIdIdx: index('finding_authorId_idx').on(table.authorId),
    contestIdIdx: index('finding_contestId_idx').on(table.contestId),
    deduplicatedFindingIdIdx: index('finding_deduplicatedFindingId_idx').on(
      table.deduplicatedFindingId,
    ),
    severityIdx: index('finding_severity_idx').on(table.severity),
    statusIdx: index('finding_status_idx').on(table.status),
  }),
)

export const findingRelations = relations(findings, ({one, many}) => ({
  contest: one(contests, {
    fields: [findings.contestId],
    references: [contests.id],
  }),
  deduplicatedFinding: one(deduplicatedFindings, {
    fields: [findings.deduplicatedFindingId],
    references: [deduplicatedFindings.id],
  }),
  author: one(users, {
    fields: [findings.authorId],
    references: [users.id],
  }),
  findingAttachments: many(findingAttachments),
  reward: one(rewards),
}))

export const insertFindingSchema = createInsertSchema(findings, {
  targetFileUrl: (schema) =>
    schema.targetFileUrl.url('Invalid target file URL.'),
  title: (schema) =>
    schema.title.min(1, {
      message: 'Title can’t be empty.',
    }),
  description: (schema) =>
    schema.description.min(1, {
      message: 'Description can’t be empty.',
    }),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectFindingSchema = createSelectSchema(findings)

export type InsertFinding = z.infer<typeof insertFindingSchema>
export type Finding = z.infer<typeof selectFindingSchema>
