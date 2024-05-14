import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback} from 'react'

type UseSearchParamsStateFn<Value extends string | number> = {
  (
    key: string,
    defaultValue?: undefined,
  ): [Value | undefined, (value: Value) => void]
  <DefaultValue extends Value>(
    key: string,
    defaultValue: DefaultValue,
  ): [Value | DefaultValue, (value: Value) => void]
}

export const useSearchParamsState: UseSearchParamsStateFn<string> = <
  DefaultValue extends string | undefined,
>(
  key: string,
  defaultValue: DefaultValue,
): [string | DefaultValue, (value: string) => void] => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const value: string | DefaultValue = searchParams.get(key) ?? defaultValue

  const setValue = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, newValue)

      router.push(`${pathname}?${params.toString()}`, {scroll: false})
    },
    [router, key, pathname, searchParams],
  )

  return [value, setValue]
}

export const useNumericSearchParamsState: UseSearchParamsStateFn<number> = <
  DefaultValue extends number | undefined,
>(
  key: string,
  defaultValue: DefaultValue,
): [number | DefaultValue, (value: number) => void] => {
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

  const setValue = useCallback(
    (newValue: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, newValue.toString())

      router.push(`${pathname}?${params.toString()}`, {scroll: false})
    },
    [router, key, pathname, searchParams],
  )

  return [value, setValue]
}
