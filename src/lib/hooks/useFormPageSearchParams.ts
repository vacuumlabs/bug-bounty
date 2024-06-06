import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'

export const useFormPageSearchParams = (numberOfPages: number) => {
  const [page, {setValue}] = useSearchParamsNumericState('page', 1)

  const actualPage = page < 1 || page > numberOfPages ? 1 : page

  return [actualPage, setValue] as const
}
