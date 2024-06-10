export const getRelativePathFromAbsolutePath = (
  _url: string,
  withSearch = true,
): string => {
  const url = new URL(_url)

  if (withSearch) {
    return url.pathname + url.search
  }

  return url.pathname
}
