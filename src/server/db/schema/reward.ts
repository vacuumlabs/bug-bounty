import {
  char,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import type {z} from 'zod'

import {findings} from './finding'
import {users} from './user'

export const rewards = pgTable(
  'reward',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    findingId: uuid('findingId')
      .notNull()
      .references(() => findings.id),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id),
    amount: numeric('amount', {precision: 20, scale: 0}).notNull(),
    transferTxHash: char('transferTxHash', {length: 64}),
    payoutDate: timestamp('payoutDate', {
      mode: 'date',
    }),
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
    findingIdIdx: index('reward_findingId_idx').on(table.findingId),
    userIdIdx: index('reward_userId_idx').on(table.userId),
  }),
)

export const rewardRelations = relations(rewards, ({one}) => ({
  finding: one(findings, {
    fields: [rewards.findingId],
    references: [findings.id],
  }),
  user: one(users, {
    fields: [rewards.userId],
    references: [users.id],
  }),
}))

export const insertRewardSchema = createInsertSchema(rewards, {
  amount: (schema) =>
    schema.amount.refine(
      (value) => !/^\d+$/.test(value),
      'Amount is not a number.',
    ),
  transferTxHash: (schema) =>
    schema.transferTxHash.min(1, 'Transfer TX hash can’t be empty.'),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectRewardSchema = createSelectSchema(rewards)

export type InsertReward = z.infer<typeof insertRewardSchema>
export type Reward = z.infer<typeof selectRewardSchema>
