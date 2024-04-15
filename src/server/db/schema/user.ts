import type {z} from 'zod'
import {relations, sql} from 'drizzle-orm'
import {
  index,
  integer,
  primaryKey,
  text,
  timestamp,
  varchar,
  pgTable,
  uuid,
} from 'drizzle-orm/pg-core'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {type AdapterAccount} from 'next-auth/adapters'

import {rewards} from './reward'
import {findings} from './finding'
import {contests} from './contest'
import {getDrizzleEnum} from '../utils/enum'

export enum UserRoles {
  JUDGE = 'judge',
  AUDITOR = 'auditor',
}

export const users = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', {length: 255}),
  role: varchar('role', {
    length: 8,
    enum: getDrizzleEnum(UserRoles),
  })
    .notNull()
    .default(UserRoles.AUDITOR),
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

const insertUsersSchema = createInsertSchema(users)
const selectUsersSchema = createSelectSchema(users)

export type InsertUser = z.infer<typeof insertUsersSchema>
export type User = z.infer<typeof selectUsersSchema>

export const usersRelations = relations(users, ({many}) => ({
  accounts: many(accounts),
  findings: many(findings),
  contests: many(contests),
  rewards: many(rewards),
}))

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id),
    type: varchar('type', {length: 255})
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', {length: 255}).notNull(),
    providerAccountId: varchar('providerAccountId', {length: 255}).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: varchar('token_type', {length: 255}),
    oauth_token: text('oauth_token'),
    oauth_token_secret: text('oauth_token_secret'),
    scope: varchar('scope', {length: 255}),
    id_token: text('id_token'),
    session_state: varchar('session_state', {length: 255}),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index('account_userId_idx').on(account.userId),
  }),
)

const insertAccountsSchema = createInsertSchema(accounts)
const selectAccountsSchema = createSelectSchema(accounts)
export type InsertAccount = z.infer<typeof insertAccountsSchema>
export type Account = z.infer<typeof selectAccountsSchema>

export const accountsRelations = relations(accounts, ({one}) => ({
  user: one(users, {fields: [accounts.userId], references: [users.id]}),
}))

export const sessions = pgTable(
  'session',
  {
    sessionToken: varchar('sessionToken', {length: 255}).notNull().primaryKey(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id),
    expires: timestamp('expires', {mode: 'date'}).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  }),
)

const insertSessionsSchema = createInsertSchema(sessions)
const selectSessionsSchema = createSelectSchema(sessions)
export type InsertSession = z.infer<typeof insertSessionsSchema>
export type Session = z.infer<typeof selectSessionsSchema>

export const sessionsRelations = relations(sessions, ({one}) => ({
  user: one(users, {fields: [sessions.userId], references: [users.id]}),
}))

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: varchar('identifier', {length: 255}).notNull(),
    token: varchar('token', {length: 255}).notNull(),
    expires: timestamp('expires', {mode: 'date'}).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({columns: [vt.identifier, vt.token]}),
  }),
)

const insertVerificationTokensSchema = createInsertSchema(verificationTokens)
const selectVerificationTokensSchema = createSelectSchema(verificationTokens)
export type InsertVerificationToken = z.infer<
  typeof insertVerificationTokensSchema
>
export type VerificationToken = z.infer<typeof selectVerificationTokensSchema>
