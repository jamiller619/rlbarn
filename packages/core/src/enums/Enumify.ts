import slugify from '../utils/slugify.js'

export interface IEnumify {
  name: string
  value: number
  // good name for files, urls, etc
  slug: string
  // returns "name"
  toString(): string
  // returns "value"
  toJSON(): number
}

/**
 * Creates a slightly enhanced form of enum types, capable
 * of containing additional metadata
 * @param startsAt The value indexes begin with. Default = 0
 * @returns A new "enumified" type
 */
export const enumify = (startsAt = 0): typeof Enumify => {
  let counter: number = startsAt
  const enums: IEnumify[] = []

  const Enumify = class implements IEnumify {
    value: number
    name: string

    static enums(): IEnumify[] {
      return enums
    }

    static values(): number[] {
      return Object.values(enums).map(({ value }) => value)
    }

    static keys(): string[] {
      return Object.values(enums).map(({ name }) => name)
    }

    static fromValue(value = 0): IEnumify | undefined {
      return enums.find((enumValue) => enumValue.value === value)
    }

    constructor(name: string) {
      this.value = (counter += 1) - 1
      this.name = name

      enums.push(this)
    }

    get slug(): string {
      return slugify(this.name)
    }

    toString(): string {
      return this.name
    }

    toJSON(): number {
      return this.value
    }
  }

  return Enumify
}
