'use server'

import {gte, lte} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {FindingOccurence} from '@/server/db/models'
import {requireServerSession} from '@/server/utils/auth'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'

export type GetMyFindingParams = {
  findingId: string
}

const getMyFindingAction = async ({findingId}: GetMyFindingParams) => {
  const session = await requireServerSession()

  const finding = await db.query.findings.findFirst({
    where: (findings, {eq}) => eq(findings.id, findingId),
    with: {
      reward: {
        columns: {
          amount: true,
        },
      },
      findingAttachments: {
        columns: {
          attachmentUrl: true,
          fileName: true,
        },
      },
      author: {
        columns: {
          id: true,
        },
      },
      contest: {
        columns: {
          repoUrl: true,
          title: true,
          startDate: true,
          endDate: true,
          status: true,
        },
      },
    },
  })

  if (finding?.author.id !== session.user.id) {
    throw new ServerError('Unauthorized access to finding.')
  }

  return finding
}

export const getMyFinding = serializeServerErrors(getMyFindingAction)

export type GetMyFindingsParams = {
  type?: FindingOccurence
}

export type MyFinding = Awaited<ReturnType<typeof getMyFindingsAction>>[number]

export const getMyFindingsAction = async ({type}: GetMyFindingsParams) => {
  const session = await requireServerSession()

  return db.query.findings.findMany({
    where: (findings, {eq, and, inArray}) =>
      and(
        eq(findings.authorId, session.user.id),
        inArray(
          findings.contestId,
          db
            .select({contestId: contests.id})
            .from(contests)
            .where(
              and(
                type === FindingOccurence.PAST
                  ? lte(contests.endDate, new Date())
                  : undefined,
                type === FindingOccurence.PRESENT
                  ? and(
                      lte(contests.startDate, new Date()),
                      gte(contests.endDate, new Date()),
                    )
                  : undefined,
              ),
            ),
        ),
      ),
    with: {
      contest: {
        columns: {
          title: true,
          status: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  })
}

export const getMyFindings = serializeServerErrors(getMyFindingsAction)
