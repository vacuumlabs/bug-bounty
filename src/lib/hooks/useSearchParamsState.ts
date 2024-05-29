import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback} from 'react'

import {getEnumMemberFilter, isEnumMember} from '../utils/common/enums'

export type SearchParamsUpdater<T> = (
  params: URLSearchParams,
  newValue: T | null,
) => URLSearchParams

type SearchParamsSetters<T> = ReturnType<typeof useSearchParamsSetters<T>>

const useSearchParamsSetters = <T>(
  getUpdatedSearchParams: SearchParamsUpdater<T>,
) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const getUpdatedUrl = useCallback(
    (newValue: T | null) => {
      const updatedParams = getUpdatedSearchParams(
        new URLSearchParams(searchParams.toString()),
        newValue,
      )

      return `${pathname}?${updatedParams.toString()}`
    },
    [pathname, searchParams, getUpdatedSearchParams],
  )

  const setValue = useCallback(
    (newValue: T | null) => {
      router.push(getUpdatedUrl(newValue), {scroll: false})
    },
    [router, getUpdatedUrl],
  )

  return {setValue, getUpdatedUrl, getUpdatedSearchParams}
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

  const updateSearchParams = useCallback(
    (params: URLSearchParams, newValue: string | null) => {
      if (newValue === null) {
        params.delete(key)
      } else {
        params.set(key, newValue)
      }
      return params
    },
    [key],
  )

  const setters = useSearchParamsSetters(updateSearchParams)

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

  const updateSearchParams = useCallback(
    (params: URLSearchParams, newValue: number | null) => {
      if (newValue === null) {
        params.delete(key)
      } else {
        params.set(key, newValue.toString())
      }
      return params
    },
    [key],
  )

  const setters = useSearchParamsSetters(updateSearchParams)

  return [value, setters]
}

export const useSearchParamsArrayState = (
  key: string,
): [string[], SearchParamsSetters<string[]>] => {
  const searchParams = useSearchParams()

  const values = searchParams.getAll(key)

  const updateSearchParams = useCallback(
    (params: URLSearchParams, newValue: string[] | null) => {
      params.delete(key)

      newValue?.forEach((item) => {
        params.append(key, item)
      })

      return params
    },
    [key],
  )

  const setters = useSearchParamsSetters(updateSearchParams)

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
