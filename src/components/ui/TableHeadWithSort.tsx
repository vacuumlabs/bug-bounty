import {ChevronDown, ChevronUp} from 'lucide-react'

import {TableHead} from './Table'

import {cn} from '@/lib/utils/client/tailwind'
import {SortParams} from '@/lib/utils/common/sorting'
import {SortDirection} from '@/lib/types/enums'

type TableHeadWithSortProps<T extends string> = {
  title: string
  setSortParams: (sortParams: SortParams<T>) => void
  sortField: T
  sortParams?: SortParams<T>
}

const TableHeadWithSort = <T extends string>({
  title,
  setSortParams,
  sortField,
  sortParams,
}: TableHeadWithSortProps<T>) => {
  return (
    <TableHead>
      <div className="flex items-center gap-[3px]">
        <span className="text-bodyM text-grey-40">{title}</span>
        <div className="flex flex-col">
          <button
            onClick={() =>
              setSortParams({direction: SortDirection.ASC, field: sortField})
            }>
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
            onClick={() =>
              setSortParams({direction: SortDirection.DESC, field: sortField})
            }>
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
