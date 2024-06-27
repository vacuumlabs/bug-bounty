'use server'

import {ServerError} from '@/lib/types/error'
import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {requireServerSession} from '@/server/utils/auth'

export type GetFindingParams = {
  findingId: string
}

const getFindingAction = async ({findingId}: GetFindingParams) => {
  const session = await requireServerSession()

  const finding = await db.query.findings.findFirst({
    where: (findings, {eq}) => eq(findings.id, findingId),
    with: {
      findingAttachments: {
        columns: {
          attachmentUrl: true,
          fileName: true,
        },
      },
      deduplicatedFinding: {
        columns: {
          title: true,
          bestFindingId: true,
        },
      },
      author: {
        columns: {
          alias: true,
          id: true,
        },
      },
      contest: {
        columns: {
          repoUrl: true,
          authorId: true,
        },
      },
    },
  })

  if (finding?.contest.authorId !== session.user.id) {
    throw new ServerError('Unauthorized access to finding.')
  }

  return finding
}

export const getFinding = serializeServerErrors(getFindingAction)

export type GetFindingsParams = {
  deduplicatedFindingId: string
}

const getFindingsAction = async ({
  deduplicatedFindingId,
}: GetFindingsParams) => {
  const session = await requireServerSession()

  const deduplicatedFinding = await db.query.deduplicatedFindings.findFirst({
    with: {
      contest: {
        columns: {
          authorId: true,
        },
      },
    },
    where: (deduplicatedFindings, {eq}) =>
      eq(deduplicatedFindings.id, deduplicatedFindingId),
  })

  if (deduplicatedFinding?.contest.authorId !== session.user.id) {
    throw new ServerError('Unauthorized access to findings.')
  }

  return db.query.findings.findMany({
    with: {
      author: {
        columns: {
          alias: true,
          id: true,
        },
      },
    },
    where: (findings, {eq}) =>
      eq(findings.deduplicatedFindingId, deduplicatedFindingId),
  })
}

export const getFindings = serializeServerErrors(getFindingsAction)
