import {ChevronDown, ChevronUp} from 'lucide-react'

import {TableHead} from './Table'

import {cn} from '@/lib/utils/client/tailwind'
import {SortParams} from '@/lib/utils/common/sorting'
import {SortDirection} from '@/lib/types/enums'
import {
  SearchParamsUpdater,
  mergeSearchParamsUpdaters,
  useUpdateSearchParams,
} from '@/lib/hooks/useSearchParamsState'

type TableHeadWithSortProps<T extends string> = {
  title: string
  updateSortSearchParams: (params: SortParams<T>) => SearchParamsUpdater[]
  sortField: T
  sortParams?: SortParams<T>
  searchParamsUpdaters?: SearchParamsUpdater[]
}

const TableHeadWithSort = <T extends string>({
  title,
  updateSortSearchParams,
  sortField,
  sortParams,
  searchParamsUpdaters,
}: TableHeadWithSortProps<T>) => {
  const updateSearchParams = useUpdateSearchParams()

  return (
    <TableHead>
      <div className="flex items-center gap-[3px]">
        <span className="text-bodyM text-grey-40">{title}</span>
        <div className="flex flex-col">
          <button
            onClick={() => {
              updateSearchParams(
                mergeSearchParamsUpdaters([
                  ...updateSortSearchParams({
                    direction: SortDirection.ASC,
                    field: sortField,
                  }),
                  ...(searchParamsUpdaters ?? []),
                ]),
              )
            }}>
            <ChevronUp
              className={cn(
                'h-4',
                sortParams?.field === sortField &&
                  sortParams.direction === SortDirection.ASC
                  ? 'text-white'
                  : 'text-grey-40',
              )}
            />
          </button>
          <button
            onClick={() => {
              updateSearchParams(
                mergeSearchParamsUpdaters([
                  ...updateSortSearchParams({
                    direction: SortDirection.DESC,
                    field: sortField,
                  }),
                  ...(searchParamsUpdaters ?? []),
                ]),
              )
            }}>
            <ChevronDown
              className={cn(
                'h-4',
                sortParams?.field === sortField &&
                  sortParams.direction === SortDirection.DESC
                  ? 'text-white'
                  : 'text-grey-40',
              )}
            />
          </button>
        </div>
      </div>
    </TableHead>
  )
}

export default TableHeadWithSort
