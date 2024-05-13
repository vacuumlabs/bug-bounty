import {useSearchParamsState} from '@/lib/hooks/useSearchParamsState'

const validContestTypes = ['current', 'future', 'past'] as const

type ValidContestType = (typeof validContestTypes)[number]

export const useSearchParamsContestType = () => {
  const [contestType, setContestType] = useSearchParamsState('type', 'current')

  const currentType = (validContestTypes as Readonly<string[]>).includes(
    contestType,
  )
    ? (contestType as ValidContestType)
    : 'current'

  return [currentType, setContestType] as const
}
