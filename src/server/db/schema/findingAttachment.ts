import {relations, sql} from 'drizzle-orm'
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'
import {z} from 'zod'

import {findings} from './finding'

export const findingAttachments = pgTable(
  'findingAttachment',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    findingId: uuid('findingId')
      .notNull()
      .references(() => findings.id, {onDelete: 'cascade'}),
    attachmentUrl: varchar('url', {length: 255}).notNull(),
    mimeType: varchar('mimeType', {length: 255}).notNull(),
    createdAt: timestamp('createdAt', {
      mode: 'date',
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updatedAt', {
      mode: 'date',
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (findingAttachment) => ({
    findingIdAttachmentUrlIdx: uniqueIndex('findingIdAttachmentUrlIdx').on(
      findingAttachment.findingId,
      findingAttachment.attachmentUrl,
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

export const insertFindingAttachmentSchema = createInsertSchema(
  findingAttachments,
  {
    attachmentUrl: (schema) =>
      schema.attachmentUrl.url('Invalid attachment URL.'),
    mimeType: (schema) => schema.mimeType.min(1, 'MIME type can’t be empty.'),
  },
)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .strict()

export const selectFindingAttachmentSchema =
  createSelectSchema(findingAttachments)

export type InsertFindingAttachment = z.infer<
  typeof insertFindingAttachmentSchema
>
export type FindingAttachment = z.infer<typeof selectFindingAttachmentSchema>
