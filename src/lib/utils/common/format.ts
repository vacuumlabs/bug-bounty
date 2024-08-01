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
  showSymbol = true,
) => {
  const parsedAmount =
    typeof lovelaceAmount === 'string'
      ? Number.parseInt(lovelaceAmount, 10)
      : lovelaceAmount

  const adaAmount = parsedAmount / 1e6

  return `${showSymbol ? '₳ ' : ''}${adaAmount.toLocaleString(APP_LOCALE, {
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
  const diff = enddate.diffNow(['days', 'hours']).toObject()

  const days = Math.floor(diff.days ?? 0)
  const hours = String(Math.floor(diff.hours ?? 0)).padStart(2, '0')

  return `${days} days ${hours} hours`
}

export const formatTxHash = (
  txHash: string | null | undefined,
  startChars = 6,
  endChars = 6,
) => {
  if (!txHash) {
    return '-'
  }

  return `${txHash.slice(0, startChars)}..${txHash.slice(-endChars)}`
}

export const formatAddress = (
  address: string | null | undefined,
  startChars = 9,
  endChars = 4,
) => {
  if (!address) {
    return '-'
  }

  return `${address.slice(0, startChars)}..${address.slice(-endChars)}`
}
