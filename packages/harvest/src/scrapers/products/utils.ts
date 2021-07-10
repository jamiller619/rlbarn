export const replaceSpacesInString = (str: string, rep = ''): string => {
  const result = str.replace(/[ ]/g, rep)

  /**
   * If the str argument looks like "foo - bar", then this
   * would return "foo---bar", so we need an additional step
   * to prevent this
   */
  return result.replace('---', '-')
}
