import {z} from 'zod'

import {ContestStatus, FindingSeverity, FindingStatus} from '@/server/db/models'
import {insertContestSchema} from '@/server/db/schema/contest'
import {insertFindingAttachmentSchema} from '@/server/db/schema/findingAttachment'
import {insertFindingSchema} from '@/server/db/schema/finding'
import {insertContestSeverityWeightsSchema} from '@/server/db/schema/contestSeverityWeights'

// Schemas can't be exported from server action files, so if we want to reuse them, we have to define them here.

export const signUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
})

export const addContestSchema = insertContestSchema
  .omit({
    authorId: true,
    distributedRewardsAmount: true,
    rewardsTransferTxHash: true,
  })
  .extend({
    status: z.enum([ContestStatus.IN_REVIEW, ContestStatus.DRAFT]),
  })
  .strict()

export const addContestSeverityWeightsSchema =
  insertContestSeverityWeightsSchema.omit({contestId: true}).strict()

export const addFindingSchema = insertFindingSchema
  .omit({
    deduplicatedFindingId: true,
    authorId: true,
  })
  .extend({
    status: z.enum([FindingStatus.PENDING, FindingStatus.DRAFT]),
  })
  .strict()

export const addFindingAttachmentSchema = insertFindingAttachmentSchema.omit({
  findingId: true,
  id: true,
})

export const rewardsTransferAddressSchema = z.string().min(1).max(128)

export const rewardsTransferTxHashSchema = z.string().min(1).max(64)

export const addDeduplicatedFindingSchema = z.object({
  deduplicatedFindingIds: z.array(
    z.object({deduplicatedFindingId: z.string().min(1)}),
  ),
})

export const editDeduplicatedFindingSchema = z.object({
  deduplicatedFindingId: z.string().uuid(),
  title: z.string().min(1),
  severity: z.enum([
    FindingSeverity.INFO,
    FindingSeverity.LOW,
    FindingSeverity.MEDIUM,
    FindingSeverity.HIGH,
    FindingSeverity.CRITICAL,
  ]),
  description: z.string().min(1),
})
