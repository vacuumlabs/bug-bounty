import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback} from 'react'

type UseSearchParamsStateFn<Value extends string[] | string | number> = {
  (
    key: string,
    defaultValue?: undefined,
  ): [Value | undefined, (value: Value) => void, (value: Value) => string]
  <DefaultValue extends Value>(
    key: string,
    defaultValue: DefaultValue,
  ): [Value | DefaultValue, (value: Value) => void, (value: Value) => string]
}

export const useSearchParamsState: UseSearchParamsStateFn<string> = <
  DefaultValue extends string | undefined,
>(
  key: string,
  defaultValue: DefaultValue,
): [
  string | DefaultValue,
  (value: string) => void,
  (value: string) => string,
] => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const value: string | DefaultValue = searchParams.get(key) ?? defaultValue

  const getNewUrl = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, newValue)

      return `${pathname}?${params.toString()}`
    },
    [key, pathname, searchParams],
  )

  const setValue = useCallback(
    (newValue: string) => {
      router.push(getNewUrl(newValue), {scroll: false})
    },
    [router, getNewUrl],
  )

  return [value, setValue, getNewUrl]
}

export const useSearchParamsNumericState: UseSearchParamsStateFn<number> = <
  DefaultValue extends number | undefined,
>(
  key: string,
  defaultValue: DefaultValue,
): [
  number | DefaultValue,
  (value: number) => void,
  (value: number) => string,
] => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const searchParamsValue = searchParams.get(key)

  const parsedSearchParamsValue = searchParamsValue
    ? Number(searchParamsValue)
    : undefined

  const numericSearchParamsValue = Number.isNaN(parsedSearchParamsValue)
    ? undefined
    : parsedSearchParamsValue

  const value: number | DefaultValue = numericSearchParamsValue ?? defaultValue

  const getNewUrl = useCallback(
    (newValue: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, newValue.toString())

      return `${pathname}?${params.toString()}`
    },
    [key, pathname, searchParams],
  )

  const setValue = useCallback(
    (newValue: number) => {
      router.push(getNewUrl(newValue), {scroll: false})
    },
    [router, getNewUrl],
  )

  return [value, setValue, getNewUrl]
}

export const useSearchParamsArrayState: UseSearchParamsStateFn<string[]> = <
  DefaultValue extends string[] | undefined,
>(
  key: string,
  defaultValue: DefaultValue,
): [
  string[] | DefaultValue,
  (value: string[]) => void,
  (value: string[]) => string,
] => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawSearchParamsValue = searchParams.getAll(key)

  const searchParamsValue =
    rawSearchParamsValue.length > 0 ? rawSearchParamsValue : defaultValue

  const value: string[] | DefaultValue = searchParamsValue ?? defaultValue

  const getNewUrl = useCallback(
    (newValue: string[]) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)

      newValue.forEach((item) => {
        params.append(key, item)
      })

      return `${pathname}?${params.toString()}`
    },
    [key, pathname, searchParams],
  )

  const setValue = useCallback(
    (newValue: string[]) => {
      router.push(getNewUrl(newValue), {scroll: false})
    },
    [router, getNewUrl],
  )

  return [value, setValue, getNewUrl]
}
