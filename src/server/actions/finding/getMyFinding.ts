'use server'

import {and, eq, gte, lte, sql} from 'drizzle-orm'

import {serializeServerErrors} from '@/lib/utils/common/error'
import {db} from '@/server/db'
import {FindingOccurence} from '@/server/db/models'
import {requireServerSession} from '@/server/utils/auth'
import {contests} from '@/server/db/schema/contest'
import {ServerError} from '@/lib/types/error'
import {findings} from '@/server/db/schema/finding'
import {PaginatedParams} from '@/lib/utils/common/pagination'
import {
  SortParams,
  myFindingsSortFieldMap,
  sortByColumn,
} from '@/lib/utils/common/sorting'
import {MyFindingsSorting, SortDirection} from '@/lib/types/enums'

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

export type GetMyFindingsParams = PaginatedParams<
  {
    type?: FindingOccurence
  },
  SortParams<MyFindingsSorting>
>

export type MyFinding = Awaited<
  ReturnType<typeof getMyFindingsAction>
>['data'][number]

export const getMyFindingsAction = async ({
  type,
  pageParams: {limit, offset = 0},
  sort = {
    direction: SortDirection.DESC,
    field: MyFindingsSorting.SUBMITTED,
  },
}: GetMyFindingsParams) => {
  const session = await requireServerSession()

  const pastCount =
    sql<number>`COUNT(*) FILTER (WHERE ${findings.contestId} IN (
    SELECT ${contests.id}
    FROM ${contests}
    WHERE ${contests.endDate} <= NOW()
  ))`.as('pastCount')

  const presentCount =
    sql<number>`COUNT(*) FILTER (WHERE ${findings.contestId} IN (
    SELECT ${contests.id}
    FROM ${contests}
    WHERE ${contests.startDate} <= NOW() AND ${contests.endDate} >= NOW()
  ))`.as('presentCount')

  const myFindingsCountQuery = db
    .select({
      pastCount,
      presentCount,
    })
    .from(findings)
    .where(and(eq(findings.authorId, session.user.id)))

  const myFindingsQuery = db.query.findings.findMany({
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
    limit,
    offset,
    orderBy: sortByColumn(sort.direction, myFindingsSortFieldMap[sort.field]),
  })

  const [myFindings, myFindingsCount] = await Promise.all([
    myFindingsQuery,
    myFindingsCountQuery,
  ])

  if (!myFindingsCount[0]) {
    throw new ServerError('Failed to get my findings total size.')
  }

  return {
    data: myFindings,
    pageParams: {
      liveCount: myFindingsCount[0].presentCount,
      pastCount: myFindingsCount[0].pastCount,
    },
  }
}

export const getMyFindings = serializeServerErrors(getMyFindingsAction)
