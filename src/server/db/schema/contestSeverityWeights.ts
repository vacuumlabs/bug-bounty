import {relations, sql} from 'drizzle-orm'
import {integer, pgTable, timestamp, uuid} from 'drizzle-orm/pg-core'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {z} from 'zod'

import {contests} from './contest'

export const contestSeverityWeights = pgTable('contestSeverityWeights', {
  id: uuid('id').defaultRandom().primaryKey(),
  contestId: uuid('contestId')
    .notNull()
    .references(() => contests.id, {onDelete: 'cascade'}),
  info: integer('info').notNull(),
  low: integer('low').notNull(),
  medium: integer('medium').notNull(),
  high: integer('high').notNull(),
  critical: integer('critical').notNull(),
  createdAt: timestamp('createdAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
})

export const contestSeverityWeightsRelations = relations(
  contestSeverityWeights,
  ({one}) => ({
    contest: one(contests),
  }),
)

export const insertContestSeverityWeightSchema = createInsertSchema(
  contestSeverityWeights,
  {
    info: (schema) =>
      schema.info.min(0, {
        message: 'Custom severity weight must be greater than or equal to 0',
      }),
    low: (schema) =>
      schema.low.min(0, {
        message: 'Custom severity weight must be greater than or equal to 0',
      }),
    medium: (schema) =>
      schema.medium.min(0, {
        message: 'Custom severity weight must be greater than or equal to 0',
      }),
    high: (schema) =>
      schema.high.min(0, {
        message: 'Custom severity weight must be greater than or equal to 0',
      }),
    critical: (schema) =>
      schema.critical.min(0, {
        message: 'Custom severity weight must be greater than or equal to 0',
      }),
  },
)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectContestSeverityWeightSchema = createSelectSchema(
  contestSeverityWeights,
)

export type InsertContestSeverityWeight = z.infer<
  typeof insertContestSeverityWeightSchema
>
export type ContestSeverityWeight = z.infer<
  typeof selectContestSeverityWeightSchema
>
