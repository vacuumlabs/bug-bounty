import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {z} from 'zod'

import {contests} from './contest'
import {findings} from './finding'
import {FindingSeverity} from '../models/enums'

import {getDrizzleEnum} from '@/server/utils/enum'

export const deduplicatedFindings = pgTable(
  'deduplicatedFinding',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contestId: uuid('contestId')
      .notNull()
      .references(() => contests.id),
    bestFindingId: uuid('bestFindingId'),
    title: varchar('name', {length: 255}).notNull(),
    description: text('description').notNull(),
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
  },
  (table) => ({
    contestIdIdx: index('deduplicatedFinding_contestId_idx').on(
      table.contestId,
    ),
    bestFindingIdIdx: index('deduplicatedFinding_bestFindingId_idx').on(
      table.bestFindingId,
    ),
    severityIdx: index('deduplicatedFinding_severity_idx').on(table.severity),
  }),
)

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

export const insertDeduplicatedFindingSchema = createInsertSchema(
  deduplicatedFindings,
  {
    title: (schema) =>
      schema.title.min(1, {
        message: 'Title can’t be empty.',
      }),
    description: (schema) =>
      schema.description.min(1, {
        message: 'Description can’t be empty.',
      }),
  },
)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectDeduplicatedFindingSchema =
  createSelectSchema(deduplicatedFindings)

export type InsertDeduplicatedFinding = z.infer<
  typeof insertDeduplicatedFindingSchema
>

export type DeduplicatedFinding = z.infer<
  typeof selectDeduplicatedFindingSchema
>
