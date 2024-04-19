import {pgTable, primaryKey, timestamp, varchar} from 'drizzle-orm/pg-core'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {z} from 'zod'

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

export const insertVerificationTokenSchema =
  createInsertSchema(verificationTokens)
export const selectVerificationTokenSchema =
  createSelectSchema(verificationTokens)
export type InsertVerificationToken = z.infer<
  typeof insertVerificationTokenSchema
>
export type VerificationToken = z.infer<typeof selectVerificationTokenSchema>
