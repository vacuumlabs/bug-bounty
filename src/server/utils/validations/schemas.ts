import {z} from 'zod'

import {ContestStatus, FindingStatus} from '@/server/db/models'
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
