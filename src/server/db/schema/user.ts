import type {z} from 'zod'
import {relations, sql} from 'drizzle-orm'
import {text, timestamp, varchar, pgTable, uuid} from 'drizzle-orm/pg-core'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'

import {rewards} from './reward'
import {findings} from './finding'
import {contests} from './contest'
import {accounts} from './account'
import {UserRole} from '../models'

import {getDrizzleEnum} from '@/server/utils/enum'

export const users = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', {length: 255}),
  alias: varchar('alias', {length: 255}).unique(),
  role: varchar('role', {
    length: 8,
    enum: getDrizzleEnum(UserRole),
  })
    .notNull()
    .default(UserRole.AUDITOR),
  walletAddress: varchar('walletAddress', {length: 255}),
  email: varchar('email', {length: 255}).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar('image', {length: 255}),
  password: text('password'),
  createdAt: timestamp('createdAt', {
    mode: 'date',
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updatedAt', {
    mode: 'date',
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
})

export const usersRelations = relations(users, ({many}) => ({
  accounts: many(accounts),
  findings: many(findings),
  contests: many(contests),
  rewards: many(rewards),
}))

export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  image: (schema) => schema.image.url(),
  name: (schema) => schema.name.min(3, 'Name must be at least 3 characters.'),
  alias: (schema) =>
    schema.alias.min(3, 'Alias must be at least 3 characters.'),
  password: (schema) => schema.password.min(1, 'Password hash can’t be empty.'),
  walletAddress: (schema) =>
    schema.walletAddress.min(1, 'Wallet address can’t be empty.'),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectUserSchema = createSelectSchema(users)

export type InsertUser = z.infer<typeof insertUserSchema>
export type User = z.infer<typeof selectUserSchema>
