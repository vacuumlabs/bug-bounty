'use client'

import {useMemo, useState} from 'react'
import {useDebounce} from 'use-debounce'
import {UseQueryResult} from '@tanstack/react-query'

import Combobox, {CommonComboboxProps} from './Combobox'

import {QUERY_DEBOUNCE_TIME} from '@/lib/constants'
import {SelectOption} from '@/lib/utils/common/enums'

type AsyncComboboxProps<T> = {
  useGetData: (searchQuery: string) => UseQueryResult<T[]>
  formatOption: (item: T) => SelectOption
} & CommonComboboxProps<string>

const AsyncCombobox = <T,>({
  formatOption,
  useGetData,
  ...props
}: AsyncComboboxProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, QUERY_DEBOUNCE_TIME)

  const {data, isFetching} = useGetData(debouncedQuery)

  const options = useMemo(
    () => data?.map(formatOption) ?? [],
    [data, formatOption],
  )

  return (
    <Combobox
      options={options}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isLoading={isFetching}
      shouldFilter={false}
      {...props}
    />
  )
}

export default AsyncCombobox
