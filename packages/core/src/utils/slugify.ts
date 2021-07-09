import slugify from '@sindresorhus/slugify'

export default (str?: string): string => {
  if (str == null) return

  return slugify(str, {
    // by default, slugify converts "ä" to "ae"
    customReplacements: [['ä', 'a']],
  })
}
