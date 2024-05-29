import {useSearchParamsNumericState} from '@/lib/hooks/useSearchParamsState'

export const useNewContestFormPageSearchParams = () => {
  const [page, {setValue}] = useSearchParamsNumericState('page', 1)

  const actualPage = page < 1 || page > 3 ? 1 : page

  return [actualPage, setValue] as const
}
