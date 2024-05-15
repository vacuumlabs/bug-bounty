import {FindingSeverity} from '@/server/db/models'

export const defaultSeverityWeights: Record<FindingSeverity, number> = {
  [FindingSeverity.CRITICAL]: 36,
  [FindingSeverity.HIGH]: 9,
  [FindingSeverity.MEDIUM]: 3,
  [FindingSeverity.LOW]: 1,
  [FindingSeverity.INFO]: 0,
}
