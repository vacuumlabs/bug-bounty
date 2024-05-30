import {useCallback, useMemo} from 'react'

import {SortParams} from '../utils/common/sorting'
import {
  useSearchParamsEnumState,
  useUpdateSearchParams,
} from './useSearchParamsState'
import {SortDirection} from '../types/enums'

export const useSortingSearchParams = <T extends string>(
  sortFieldsEnum: Record<string, T>,
) => {
  const updateSearchParams = useUpdateSearchParams()

  const [sortDirection, {getSearchParamsUpdater: updateSortDirection}] =
    useSearchParamsEnumState('sortDirection', SortDirection, SortDirection.DESC)
  const [sortBy, {getSearchParamsUpdater: updateSortBy}] =
    useSearchParamsEnumState('sortBy', sortFieldsEnum)

  const setSortParams = useCallback(
    (params: SortParams<T>) =>
      updateSearchParams([
        updateSortDirection(params.direction),
        updateSortBy(params.field),
      ]),
    [updateSortDirection, updateSortBy, updateSearchParams],
  )

  const sortParams: SortParams<T> | undefined = useMemo(
    () =>
      sortBy
        ? {
            field: sortBy,
            direction: sortDirection,
          }
        : undefined,
    [sortBy, sortDirection],
  )

  return [sortParams, setSortParams] as const
}
