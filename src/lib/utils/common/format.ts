import {DateTime, DateTimeFormatOptions} from 'luxon'

export const APP_LOCALE = 'en-US'

export const ellipsizeText = (text: string, maxLength: number) => {
  const trimmedText = text.trim()

  return trimmedText.length <= maxLength
    ? trimmedText
    : `${trimmedText.slice(0, maxLength)}...`
}

export const formatAda = (
  lovelaceAmount: string | number,
  maximumFractionDigits = 2,
) => {
  const parsedAmount =
    typeof lovelaceAmount === 'string'
      ? Number.parseInt(lovelaceAmount, 10)
      : lovelaceAmount

  const adaAmount = parsedAmount / 1e6

  return `₳ ${adaAmount.toLocaleString(APP_LOCALE, {
    maximumFractionDigits,
  })}`
}

export const formatTabCount = (count: number | undefined) =>
  count == null ? '' : ` (${count})`

export const formatDate = (date: Date, format?: DateTimeFormatOptions) =>
  DateTime.fromJSDate(date).toLocaleString(format, {
    locale: 'en',
  })

export const formatTimeRemaining = (endDate: Date) => {
  const enddate = DateTime.fromJSDate(endDate)
  const now = DateTime.now()
  const diff = enddate.diff(now, ['days', 'hours']).toObject()

  const days = Math.floor(diff.days ?? 0)
  const hours = String(Math.floor(diff.hours ?? 0)).padStart(2, '0')

  return `${days} days ${hours} hours`
}
