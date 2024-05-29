import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback} from 'react'

import {getEnumMemberFilter, isEnumMember} from '../utils/common/enums'

export type SearchParamsUpdater = (
  searchParams: URLSearchParams,
) => URLSearchParams

export type SearchParamsUpdaterFactory<T> = (
  newValue: T | null,
) => SearchParamsUpdater

type SearchParamsSetters<T> = ReturnType<typeof useSearchParamsSetters<T>>

const useSearchParamsSetters = <T>(
  getSearchParamsUpdater: SearchParamsUpdaterFactory<T>,
) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const getUpdatedUrl = useCallback(
    (newValue: T | null) => {
      const updater = getSearchParamsUpdater(newValue)

      const updatedParams = updater(
        new URLSearchParams(searchParams.toString()),
      )

      return `${pathname}?${updatedParams.toString()}`
    },
    [pathname, searchParams, getSearchParamsUpdater],
  )

  const setValue = useCallback(
    (newValue: T | null) => {
      router.push(getUpdatedUrl(newValue), {scroll: false})
    },
    [router, getUpdatedUrl],
  )

  return {
    setValue,
    getUpdatedUrl,
    getSearchParamsUpdater,
  }
}

type UseSearchParamsStateFn<Value extends string[] | string | number> = {
  (
    key: string,
    defaultValue?: undefined,
  ): [Value | undefined, SearchParamsSetters<Value>]
  <DefaultValue extends Value>(
    key: string,
    defaultValue: DefaultValue,
  ): [Value | DefaultValue, SearchParamsSetters<Value>]
}

export const useSearchParamsState: UseSearchParamsStateFn<string> = <
  DefaultValue extends string | undefined,
>(
  key: string,
  defaultValue: DefaultValue,
): [string | DefaultValue, SearchParamsSetters<string>] => {
  const searchParams = useSearchParams()

  const value: string | DefaultValue = searchParams.get(key) ?? defaultValue

  const getSearchParamsUpdater = useCallback(
    (newValue: string | null) => (params: URLSearchParams) => {
      if (newValue === null) {
        params.delete(key)
      } else {
        params.set(key, newValue)
      }
      return params
    },
    [key],
  )

  const setters = useSearchParamsSetters(getSearchParamsUpdater)

  return [value, setters]
}

export const useSearchParamsNumericState: UseSearchParamsStateFn<number> = <
  DefaultValue extends number | undefined,
>(
  key: string,
  defaultValue: DefaultValue,
): [number | DefaultValue, SearchParamsSetters<number>] => {
  const searchParams = useSearchParams()

  const searchParamsValue = searchParams.get(key)

  const parsedSearchParamsValue = searchParamsValue
    ? Number(searchParamsValue)
    : undefined

  const numericSearchParamsValue = Number.isNaN(parsedSearchParamsValue)
    ? undefined
    : parsedSearchParamsValue

  const value: number | DefaultValue = numericSearchParamsValue ?? defaultValue

  const getSearchParamsUpdater = useCallback(
    (newValue: number | null) => (params: URLSearchParams) => {
      if (newValue === null) {
        params.delete(key)
      } else {
        params.set(key, newValue.toString())
      }
      return params
    },
    [key],
  )

  const setters = useSearchParamsSetters(getSearchParamsUpdater)

  return [value, setters]
}

export const useSearchParamsArrayState = (
  key: string,
): [string[], SearchParamsSetters<string[]>] => {
  const searchParams = useSearchParams()

  const values = searchParams.getAll(key)

  const getSearchParamsUpdater = useCallback(
    (newValue: string[] | null) => (params: URLSearchParams) => {
      params.delete(key)

      newValue?.forEach((item) => {
        params.append(key, item)
      })

      return params
    },
    [key],
  )

  const setters = useSearchParamsSetters(getSearchParamsUpdater)

  return [values, setters]
}

export const useSearchParamsEnumArrayState = <T extends string>(
  key: string,
  enumObject: Record<string, T>,
) => {
  const [values, setters] = useSearchParamsArrayState(key)

  const validValues = values.filter(getEnumMemberFilter(enumObject))

  return [validValues, setters] as const
}

export const useSearchParamsEnumState = <T extends string>(
  key: string,
  enumObject: Record<string, T>,
  defaultValue: T,
) => {
  const [value, setters] = useSearchParamsState(key, defaultValue)

  const currentValue = isEnumMember(enumObject, value) ? value : defaultValue

  return [currentValue, setters] as const
}

export const usePushUpdatedSearchParams = () => {
  const router = useRouter()
  const pathname = usePathname()

  return useCallback(
    (updatedSearchParams: URLSearchParams) => {
      router.push(`${pathname}?${updatedSearchParams.toString()}`, {
        scroll: false,
      })
    },
    [pathname, router],
  )
}

export const useResetSearchParamsKeys = () => {
  const searchParams = useSearchParams()
  const pushUpdatedSearchParams = usePushUpdatedSearchParams()

  return useCallback(
    (keys: string[]) => {
      const params = new URLSearchParams(searchParams.toString())

      keys.forEach((key) => params.delete(key))

      pushUpdatedSearchParams(params)
    },
    [searchParams, pushUpdatedSearchParams],
  )
}

export const mergeSearchParamsUpdaters =
  (updaters: SearchParamsUpdater[]): SearchParamsUpdater =>
  (searchParams) =>
    updaters.reduce((params, updater) => updater(params), searchParams)

export const useUpdateSearchParams = () => {
  const searchParams = useSearchParams()
  const pushUpdatedSearchParams = usePushUpdatedSearchParams()

  return useCallback(
    (updater: SearchParamsUpdater[] | SearchParamsUpdater) => {
      const currentSearchParams = new URLSearchParams(searchParams.toString())

      const updateSearchParams = Array.isArray(updater)
        ? mergeSearchParamsUpdaters(updater)
        : updater

      pushUpdatedSearchParams(updateSearchParams(currentSearchParams))
    },
    [searchParams, pushUpdatedSearchParams],
  )
}
