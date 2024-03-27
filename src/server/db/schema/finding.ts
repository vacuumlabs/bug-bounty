import type {z} from 'zod'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {contests} from './contest'

export const FINDING_SEVERITY = [
  'info',
  'low',
  'medium',
  'high',
  'critical',
] as const
export type FindingSeverity = (typeof FINDING_SEVERITY)[number]

export const findings = pgTable('finding', {
  id: varchar('id', {length: 255}).notNull().primaryKey(),
  contestId: varchar('contestId', {length: 255}).notNull(),
  deduplicatedFindingId: varchar('deduplicatedFindingId', {length: 255}),
  title: varchar('name', {length: 255}).notNull(),
  description: text('description').notNull(),
  targetFileUrl: varchar('targetFileUrl', {length: 255}).notNull(),
  severity: varchar('severity', {length: 8, enum: FINDING_SEVERITY}).notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
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
  findingAttachments: many(findingAttachments),
}))

export const findingAttachments = pgTable(
  'findingAttachment',
  {
    id: varchar('id', {length: 255}).notNull().primaryKey(),
    findingId: varchar('findingId', {length: 255}).notNull(),
    attachmentUrl: varchar('url', {length: 255}).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (findintAttachment) => ({
    findingIdAttachmentUrlIdx: uniqueIndex('findingIdAttachmentUrlIdx').on(
      findintAttachment.findingId,
      findintAttachment.attachmentUrl,
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

const insertFindingsSchema = createInsertSchema(findings)
const selectFindingsSchema = createSelectSchema(findings)
export type InsertFinding = z.infer<typeof insertFindingsSchema>
export type Finding = z.infer<typeof selectFindingsSchema>

export const FINDING_STATUS = ['approved', 'rejected'] as const
export type FindingStatus = (typeof FINDING_STATUS)[number]

export const deduplicatedFindings = pgTable('deduplicatedFinding', {
  id: varchar('id', {length: 255}).notNull().primaryKey(),
  contestId: varchar('contestId', {length: 255}).notNull(),
  title: varchar('name', {length: 255}).notNull(),
  description: text('description').notNull(),
  severity: varchar('severity', {length: 8, enum: FINDING_SEVERITY}).notNull(),
  status: varchar('status', {length: 8, enum: FINDING_STATUS}),
  createdAt: timestamp('createdAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
})

export const deduplicatedFindingRelations = relations(
  deduplicatedFindings,
  ({one, many}) => ({
    contest: one(contests, {
      fields: [deduplicatedFindings.contestId],
      references: [contests.id],
    }),
    findings: many(findings),
    deduplicatedFindingAttachments: many(deduplicatedFindingAttatchments),
  }),
)

export const deduplicatedFindingAttatchments = pgTable(
  'deduplicatedFindingAttachment',
  {
    id: varchar('id', {length: 255}).notNull().primaryKey(),
    deduplicatedFindingId: varchar('deduplicatedFindingId', {
      length: 255,
    }).notNull(),
    attachmentUrl: varchar('url', {length: 255}).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (deduplicatedFindingAttachment) => ({
    deduplicatedFindingIdAttachmentUrlIdx: uniqueIndex(
      'deduplicatedFindingIdAttachmentUrlIdx',
    ).on(
      deduplicatedFindingAttachment.deduplicatedFindingId,
      deduplicatedFindingAttachment.attachmentUrl,
    ),
  }),
)

export const deduplicatedFindingAttachmentRelations = relations(
  deduplicatedFindingAttatchments,
  ({one}) => ({
    deduplicatedFinding: one(deduplicatedFindings, {
      fields: [deduplicatedFindingAttatchments.deduplicatedFindingId],
      references: [deduplicatedFindings.id],
    }),
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
