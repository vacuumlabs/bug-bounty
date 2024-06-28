import {ContestSorting, ContestStatusText} from '@/lib/types/enums'
import {
  ContestStatus,
  FindingSeverity,
  FindingStatus,
  ProjectCategory,
  ProjectLanguage,
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
    [ContestStatus.IN_REVIEW]: 'In review',
    [ContestStatus.PENDING]: 'Pending',
    [ContestStatus.APPROVED]: 'Approved',
    [ContestStatus.REJECTED]: 'Rejected',
    [ContestStatus.FINISHED]: 'Finished',
  },
  contestStatusText: {
    [ContestStatusText.draft]: 'Draft',
    [ContestStatusText.rejected]: 'Rejected',
    [ContestStatusText.finished]: 'Finished',
    [ContestStatusText.notApproved]: 'Not Approved',
    [ContestStatusText.inReview]: 'In Review',
    [ContestStatusText.pending]: 'Pending',
    [ContestStatusText.judging]: 'Judging',
    [ContestStatusText.live]: 'Live',
    [ContestStatusText.approved]: 'Approved',
  },
  contestSorting: {
    [ContestSorting.START_DATE]: 'Start date',
    [ContestSorting.END_DATE]: 'End date',
    [ContestSorting.TITLE]: 'Title',
    [ContestSorting.REWARDS_AMOUNT]: 'Reward',
  },
  projectLanguage: {
    [ProjectLanguage.AIKEN]: 'Aiken',
    [ProjectLanguage.PLUTARCH]: 'Plutarch',
    [ProjectLanguage.PLUTUS]: 'Plutus',
    [ProjectLanguage.OTHER]: 'Other',
  },
  projectCategory: {
    [ProjectCategory.BLOCKCHAIN]: 'Blockchain',
    [ProjectCategory.DEFI]: 'DeFi',
    [ProjectCategory.EXCHANGE]: 'Exchange',
    [ProjectCategory.INFRASTRUCTURE]: 'Infrastructure',
    [ProjectCategory.NFT]: 'NFT',
    [ProjectCategory.OTHER]: 'Other',
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
  contestStatusText: getTranslations(translations.contestStatusText),
  contestSorting: getTranslations(translations.contestSorting),
  projectLanguage: getTranslations(translations.projectLanguage),
  projectCategory: getTranslations(translations.projectCategory),
} satisfies Record<keyof typeof translations, () => string>

export const selectOptions = {
  userRole: createSelectOptions(translations.userRole),
  findingSeverity: createSelectOptions(translations.findingSeverity),
  contestStatus: createSelectOptions(translations.contestStatus),
  findingStatus: createSelectOptions(translations.findingStatus),
  projectLanguage: createSelectOptions(translations.projectLanguage),
  projectCategory: createSelectOptions(translations.projectCategory),
}

export const isEnumMember = <T extends string>(
  enumObject: Record<string, T>,
  value: string,
): value is T => Object.values<string>(enumObject).includes(value)

export const getEnumMemberFilter =
  <T extends string>(enumObject: Record<string, T>) =>
  (value: string): value is T =>
    isEnumMember(enumObject, value)

export const isStringUnionMember = <T extends string>(
  union: T[],
  value: string,
): value is T => (union as string[]).includes(value)
