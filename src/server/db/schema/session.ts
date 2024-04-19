import {index, pgTable, timestamp, uuid, varchar} from 'drizzle-orm/pg-core'
import {relations, sql} from 'drizzle-orm'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {z} from 'zod'

import {users} from './user'

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

export const sessionsRelations = relations(sessions, ({one}) => ({
  user: one(users, {fields: [sessions.userId], references: [users.id]}),
}))

export const insertSessionSchema = createInsertSchema(sessions).omit({
  createdAt: true,
  updatedAt: true,
})
export const selectSessionSchema = createSelectSchema(sessions)
export type InsertSession = z.infer<typeof insertSessionSchema>
export type Session = z.infer<typeof selectSessionSchema>
