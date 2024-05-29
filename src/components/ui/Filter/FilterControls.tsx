'use client'

import {Settings2} from 'lucide-react'
import {useMemo, useState} from 'react'

import {Button} from '../Button'
import FilterSelect, {FilterSelectProps} from './FilterSelect'

import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/Popover'
import {getUpdatedArray} from '@/lib/utils/common/arrays'
import {
  SearchParamsUpdaterFactory,
  useUpdateSearchParams,
} from '@/lib/hooks/useSearchParamsState'

export type Filter = Pick<FilterSelectProps, 'label' | 'options' | 'values'> & {
  getSearchParamsUpdater: SearchParamsUpdaterFactory<string[]>
}

type FilterControlsProps = {
  filters: Filter[]
}

const FilterControls = ({filters}: FilterControlsProps) => {
  const updateSearchParams = useUpdateSearchParams()

  const [filterValues, setFilterValues] = useState(() =>
    filters.map(({values}) => values),
  )

  const getFilterSetter = (index: number) => (newValues: string[]) => {
    setFilterValues((prev) => getUpdatedArray(prev, newValues, index))
  }

  const applyFilters = () => {
    const updaters = filters.map(({getSearchParamsUpdater}, index) =>
      getSearchParamsUpdater(filterValues[index] ?? []),
    )

    updateSearchParams(updaters)
  }

  const onReset = () => {
    setFilterValues(filters.map(() => []))

    updateSearchParams(
      filters.map(({getSearchParamsUpdater}) => getSearchParamsUpdater([])),
    )
  }

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // reset selected checkboxes when popover is closed without applying the filters
      setFilterValues(filters.map(({values}) => values))
    }
  }

  const numberOfSelectedFilters = useMemo(
    () =>
      filters.reduce(
        (count, {values}) => (values.length > 0 ? count + 1 : count),
        0,
      ),
    [filters],
  )

  return (
    <Popover onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2" size="small">
          Filter
          <Settings2 className="rotate-90" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[520px] p-8" align="end">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            {filters.map(({options, label}, index) => (
              <FilterSelect
                key={label}
                onChange={getFilterSetter(index)}
                values={filterValues[index] ?? []}
                options={options}
                label={label}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={onReset}>
              Reset
            </Button>
            <div className="flex items-center gap-3">
              {numberOfSelectedFilters ? (
                <span>{`Filters selected (${numberOfSelectedFilters})`}</span>
              ) : null}
              <Button onClick={applyFilters}>Apply</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterControls
