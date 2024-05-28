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

  return `₳ ${adaAmount.toLocaleString('en-US', {
    maximumFractionDigits,
  })}`
}

export const formatTabCount = (count: number | undefined) =>
  count == null ? '' : ` (${count})`
