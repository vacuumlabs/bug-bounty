import type {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'

import {contests} from './contest'
import {users} from './user'
import {getDrizzleEnum} from '../utils/enum'

export enum FindingSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export const findings = pgTable('finding', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorId: uuid('authorId').notNull(),
  contestId: varchar('contestId', {length: 255}).notNull(),
  deduplicatedFindingId: varchar('deduplicatedFindingId', {length: 255}),
  title: varchar('name', {length: 255}).notNull(),
  description: text('description').notNull(),
  targetFileUrl: varchar('targetFileUrl', {length: 255}).notNull(),
  severity: varchar('severity', {
    length: 8,
    enum: getDrizzleEnum(FindingSeverity),
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
}))

const insertFindingsSchema = createInsertSchema(findings)
const selectFindingsSchema = createSelectSchema(findings)
export type InsertFinding = z.infer<typeof insertFindingsSchema>
export type Finding = z.infer<typeof selectFindingsSchema>

export const findingAttachments = pgTable(
  'findingAttachment',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    findingId: uuid('findingId').notNull(),
    attachmentUrl: varchar('url', {length: 255}).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (findingAttachment) => ({
    findingIdAttachmentUrlIdx: uniqueIndex('findingIdAttachmentUrlIdx').on(
      findingAttachment.findingId,
      findingAttachment.attachmentUrl,
    ),
  }),
)

export const findingAttachmentRelations = relations(
  findingAttachments,
  ({one}) => ({
    finding: one(findings, {
      fields: [findingAttachments.findingId],
      references: [findings.id],
    }),
  }),
)

const insertFindingAttachmentsSchema = createInsertSchema(findingAttachments)
const selectFindingAttachmentsSchema = createSelectSchema(findingAttachments)
export type InsertFindingAttachment = z.infer<
  typeof insertFindingAttachmentsSchema
>
export type FindingAttachment = z.infer<typeof selectFindingAttachmentsSchema>

export enum FindingStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export const deduplicatedFindings = pgTable('deduplicatedFinding', {
  id: uuid('id').defaultRandom().primaryKey(),
  contestId: uuid('contestId').notNull(),
  bestFindingId: uuid('bestFindingId'),
  title: varchar('name', {length: 255}).notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', {
    length: 8,
    enum: getDrizzleEnum(FindingSeverity),
  }).notNull(),
  status: varchar('status', {
    length: 8,
    enum: getDrizzleEnum(FindingStatus),
  }).default(FindingStatus.PENDING),
  createdAt: timestamp('createdAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
})

export const deduplicatedFindingRelations = relations(
  deduplicatedFindings,
  ({one, many}) => ({
    bestFinding: one(findings, {
      fields: [deduplicatedFindings.bestFindingId],
      references: [findings.id],
    }),
    contest: one(contests, {
      fields: [deduplicatedFindings.contestId],
      references: [contests.id],
    }),
    findings: many(findings),
  }),
)

const insertDeduplicatedFindingsSchema =
  createInsertSchema(deduplicatedFindings)
const selectDeduplicatedFindingsSchema =
  createSelectSchema(deduplicatedFindings)
export type InsertDeduplicatedFinding = z.infer<
  typeof insertDeduplicatedFindingsSchema
>
export type DeduplicatedFinding = z.infer<
  typeof selectDeduplicatedFindingsSchema
>
