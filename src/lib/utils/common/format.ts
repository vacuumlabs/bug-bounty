export const ellipsizeText = (text: string, maxLength: number) => {
  const trimmedText = text.trim()

  return trimmedText.length <= maxLength
    ? trimmedText
    : `${trimmedText.slice(0, maxLength)}...`
}

export const formatAda = (lovelaceAmount: string) => {
  const adaAmount = Number.parseInt(lovelaceAmount, 10) / 1e6

  return `₳ ${adaAmount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`
}

export const formatTabCount = (count: number | undefined) =>
  count == null ? '' : ` (${count})`
