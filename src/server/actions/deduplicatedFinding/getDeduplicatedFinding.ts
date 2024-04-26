'use server'

import {db} from '@/server/db'

export type GetDeduplicatedFindingsParams = {
  contestId: string
}

export const getDeduplicatedFindings = async (
  request: GetDeduplicatedFindingsParams,
) => {
  return db.query.deduplicatedFindings.findMany({
    where: (deduplicatedFindings, {eq}) =>
      eq(deduplicatedFindings.contestId, request.contestId),
  })
}
