export const getRelativePathFromAbsolutePath = (_url: string): string => {
  const url = new URL(_url)

  return url.pathname + url.search
}
