import {Dispatch, SetStateAction, useEffect, useId, useState} from 'react'

const getItem = <T>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key)
    return item == null ? null : (JSON.parse(item) as T)
  } catch (error) {
    console.error(error)
    return null
  }
}

const setItem = (key: string, value: unknown) => {
  if (value == null) {
    window.localStorage.removeItem(key)
  } else {
    const stringifiedValue = JSON.stringify(value)
    window.localStorage.setItem(key, stringifiedValue)
  }
}

export const useLocalStorage = <T>(
  key?: string,
  defaultValue?: T,
): [T | null, Dispatch<SetStateAction<T | null>>] => {
  const generatedKey = useId()
  const storageKey = key ?? generatedKey

  const [value, setValue] = useState<T | null>(
    () => getItem(storageKey) ?? defaultValue ?? null,
  )

  useEffect(() => {
    setItem(storageKey, value)
  }, [value, storageKey])

  return [value, setValue]
}
