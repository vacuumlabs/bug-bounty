import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback} from 'react'

type UseSearchParamsStateFn = {
  (
    key: string,
    defaultValue?: undefined,
  ): [string | undefined, (value: string) => void]
  <DefaultValue extends string>(
    key: string,
    defaultValue: DefaultValue,
  ): [string | DefaultValue, (value: string) => void]
}

export const useSearchParamsState: UseSearchParamsStateFn = <
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
