import {
  ContestStatus,
  FindingSeverity,
  FindingStatus,
  UserRole,
} from '@/server/db/models'

export type SelectOption<T = string> = {
  value: T
  label: string
}

const translations = {
  userRole: {
    [UserRole.AUDITOR]: 'Auditor',
    [UserRole.JUDGE]: 'Judge',
  },
  findingSeverity: {
    [FindingSeverity.INFO]: 'Info',
    [FindingSeverity.LOW]: 'Low',
    [FindingSeverity.MEDIUM]: 'Medium',
    [FindingSeverity.HIGH]: 'High',
    [FindingSeverity.CRITICAL]: 'Critical',
  },
  findingStatus: {
    [FindingStatus.DRAFT]: 'Draft',
    [FindingStatus.PENDING]: 'Pending',
    [FindingStatus.APPROVED]: 'Approved',
    [FindingStatus.REJECTED]: 'Rejected',
  },
  contestStatus: {
    [ContestStatus.DRAFT]: 'Draft',
    [ContestStatus.PENDING]: 'Pending',
    [ContestStatus.APPROVED]: 'Approved',
    [ContestStatus.REJECTED]: 'Rejected',
  },
}

export const createSelectOptions = <T extends string>(
  translations: Record<T, string>,
): SelectOption<T>[] =>
  Object.keys(translations)
    .map((key) => key as keyof typeof translations)
    .map((key) => ({
      label: translations[key],
      value: key,
    }))

const translateEnumValue = <T extends string>(
  translations: Record<T, string>,
  value: T[] | T | null | undefined,
  defaultValue = '',
): string => {
  if (Array.isArray(value)) {
    return value.map((val) => translateEnumValue(translations, val)).join(', ')
  }
  if (!value) {
    return defaultValue
  }
  return translations[value]
}

const getTranslations =
  <T extends string>(translations: Record<T, string>) =>
  (value?: T[] | T | null, defaultValue?: string) =>
    translateEnumValue(translations, value, defaultValue)

export const translateEnum = {
  userRole: getTranslations(translations.userRole),
  findingSeverity: getTranslations(translations.findingSeverity),
  findingStatus: getTranslations(translations.findingStatus),
  contestStatus: getTranslations(translations.contestStatus),
} satisfies Record<keyof typeof translations, () => void>

export const selectOptions = {
  userRole: createSelectOptions(translations.userRole),
  findingSeverity: createSelectOptions(translations.findingSeverity),
  contestStatus: createSelectOptions(translations.contestStatus),
  findingStatus: createSelectOptions(translations.findingStatus),
} satisfies Record<keyof typeof translations, SelectOption<unknown>[]>

export const isEnumMember = <T extends string>(
  enumObject: Record<string, T>,
  value: string,
): value is T => Object.values<string>(enumObject).includes(value)
