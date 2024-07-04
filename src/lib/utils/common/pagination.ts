import {UseQueryResult} from '@tanstack/react-query'

export type PaginatedParams<T = undefined, S = undefined> = (T extends undefined
  ? object
  : T) & {
  pageParams: {
    limit: number
    offset?: number
  }
} & (S extends undefined ? object : {sort: S | undefined})

export type PaginatedResponse<T> = {
  data: UseQueryResult<T>
  pageParams: {
    totalCount: number | undefined
  }
}
