import {useSearchParamsState} from '@/lib/hooks/useSearchParamsState'
import {isEnumMember} from '@/lib/utils/common/enums'
import {ContestOccurence} from '@/server/db/models'

export const useSearchParamsContestType = () => {
  const [contestType, setContestType] = useSearchParamsState(
    'type',
    ContestOccurence.PRESENT,
  )

  const currentType = isEnumMember(ContestOccurence, contestType)
    ? contestType
    : ContestOccurence.PRESENT

  return [currentType, setContestType] as const
}
