import {numeric, pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'

import {getDrizzleEnum} from '../utils/enum'
import {findings} from './finding'
import {users} from './user'

export enum RewardStatus {
  PAID = 'paid',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export const rewards = pgTable('reward', {
  id: uuid('id').defaultRandom().primaryKey(),
  findingId: uuid('findingId').notNull(),
  userId: uuid('userId').notNull(),
  amount: numeric('amount').notNull(),
  status: varchar('status', {
    length: 8,
    enum: getDrizzleEnum(RewardStatus),
  }).notNull(),
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
})

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
