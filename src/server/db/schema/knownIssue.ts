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

export const knownIssues = pgTable(
  'knownIssue',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contestId: uuid('contestId')
      .notNull()
      .references(() => contests.id, {onDelete: 'cascade'}),
    title: varchar('title', {length: 255}).notNull(),
    description: text('description').notNull(),
    fileUrl: varchar('fileUrl', {length: 255}).notNull(),
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
    contestIdIdx: index('knownIssue_contestId_idx').on(table.contestId),
  }),
)

export const knownIssueRelations = relations(knownIssues, ({one}) => ({
  contest: one(contests, {
    fields: [knownIssues.contestId],
    references: [contests.id],
  }),
}))

export const insertKnownIssueSchema = createInsertSchema(knownIssues, {
  fileUrl: (schema) => schema.fileUrl.url('Invalid file URL.'),
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectKnownIssueSchema = createSelectSchema(knownIssues)

export type InsertKnownIssue = z.infer<typeof insertKnownIssueSchema>
export type KnownIssue = z.infer<typeof selectKnownIssueSchema>
