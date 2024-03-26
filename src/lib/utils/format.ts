export const ellipsizeText = (text: string, maxLength: number) => {
  const trimmedText = text.trim()

  return trimmedText.length <= maxLength
    ? trimmedText
    : `${trimmedText.slice(0, maxLength)}...`
}
