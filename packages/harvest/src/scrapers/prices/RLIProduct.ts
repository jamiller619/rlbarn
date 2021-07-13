import {
  Category,
  PaintColor,
  Quality,
  SpecialEdition,
} from '@rlbarn/core/dist/enums/index.js'
import { PriceData, Price } from '@rlbarn/core/dist/prices/Price.js'
import { ProductVariation } from '@rlbarn/core/dist/products/Product.js'
import { toObjectId, createObjectId } from '@rlbarn/core/dist/database.js'
import {
  categoryMap,
  qualityMap,
  qualityAttributeMap,
  paintColorMap,
} from './map.js'

export class RLIProduct {
  el: HTMLElement
  name: string
  otherNames?: string[]
  editionName?: string
  parentName?: string
  pvId: string

  toDocument(): Price {
    return {
      _id: createObjectId(),
      createDate: new Date(),
      pvId: toObjectId(this.pvId),
      data: this.prices.map((data) => {
        return {
          paintId: data.paint.value,
          ...data.prices,
        }
      }),
    }
  }

  toDocumentVariation(): ProductVariation {
    return {
      _id: createObjectId(),
      qualityId: this.quality.value,
      rliId: this.rliId,
    }
  }

  fromElement(el: HTMLElement): RLIProduct {
    this.el = el

    const itemName = el.dataset['itemname']
    const itemFullName = el.dataset['itemfullname']

    const { name, editionName, parentName } = parseNames(itemFullName)

    const otherNamesFilter = [name, parentName]
    const otherNames = parseOtherNames(itemName, otherNamesFilter)

    this.name = name
    this.editionName = editionName
    this.parentName = parentName
    this.otherNames = otherNames

    return this
  }

  get rliId(): number {
    return this.prices[0].rliId
  }

  get category(): Category {
    return categoryMap[this.el.dataset.itemtype]
  }

  get quality(): Quality {
    const quality = this.el.dataset.itemrarity?.replace(/[|]/g, '')

    return qualityAttributeMap[quality]
  }

  get edition(): SpecialEdition {
    if (
      this.category.value === Category.WHEEL.value &&
      this.editionName != null &&
      this.editionName.toUpperCase
    ) {
      const edition = Object.keys(SpecialEdition).find(
        (name) => name === this.editionName.toUpperCase()
      )

      if (edition != null) {
        return SpecialEdition[edition]
      }
    }
  }

  get nameWithEdition(): string {
    return this.edition != null
      ? `${this.name}: ${this.edition.name}`
      : this.name
  }

  get prices(): DataInfo[] {
    const paintNodes = Array.from(
      this.el.querySelectorAll('.priceRange:not(.invisibleColumn)')
    ) as HTMLElement[]

    return paintNodes
      .map((node) => parseInfo(node.dataset['info']))
      .filter((info) => info != null)
  }
}

type DataInfo = {
  rliId: number
  paint: PaintColor
  quality: Quality
  prices: Partial<PriceData>
}

const parseInfo = (dataInfo: string): DataInfo => {
  const data = JSON.parse(dataInfo)

  if (data != null) {
    const { pc, ps4: ps, xbox } = data.k
    const bp = data.b

    return {
      rliId: data.i,
      paint: paintColorMap.find(({ id }) => id === data.p).paint,
      quality: qualityMap.find(({ id }) => id === data.r).quality,
      prices: {
        pc,
        ps,
        xbox,
        switch: data.k.switch,
        bp: {
          pc: bp?.pc,
          ps: bp?.ps4,
          xbox: bp?.xbox,
          switch: bp?.switch,
        },
      },
    }
  }
}

type Names = {
  name: string
  editionName?: string
  parentName?: string
}

const lowerCaseEditionNames = SpecialEdition.keys().map((key) =>
  key.toLowerCase()
)
const otherNamesExcludeWordFilter = [
  'special',
  'edition',
  'se',
  ...lowerCaseEditionNames,
]

/**
 * RLI has two data attributes for item names:
 * 1: data-itemname
 *  - Always lowercase
 *  - Can be undefined
 *  - Can sometimes include many words, often repeated:
 *    "Tremor: Inverted":
 *      tremor special tremor special edition
 *      tremor se inverted tremor se tremor: inverted
 *      - The "long" names appear to be isolated to
 *        wheels, or items with an edition attribute
 * 2: data-itemfullname
 *  - Proper case
 *  - Appears to be the "display" version of the two
 *
 * If the item has edition and/or belongs to a "parent",
 * then both attributes will contain that information. We
 * have to parse here, in addition to checking the data
 * attribute, because they don't always appear to have both,
 * usually just one or the other.
 * Parents have "[" like: "Kana [Octane]"
 * Editions have a ":" like: "Polyergic: Inverted"
 *
 * Snippet:
 *  var a = Array.from(document.querySelectorAll('[data-itemfullname]'))
 *  var b = a.map((e) => e.dataset)
 *  var c = b.map(({ itemfullname, itemname }) => ({ itemfullname, itemname }))
 */
const splitOtherNames = (otherNamesString: string) => {
  const brackets = otherNamesString.match('\\[.*]')

  if (brackets != null) {
    const names = otherNamesString.replace(brackets[0], '').split(' ')

    names.push(brackets[0].replace('[', '').replace(']', ''))

    return names
  }

  return otherNamesString.split(' ')
}

const parseOtherNames = (otherNamesString: string, namesToFilter: string[]) => {
  const otherNames = splitOtherNames(otherNamesString).filter(
    (n) => n != null && n !== ''
  )
  const lowerCaseNames = namesToFilter
    .filter((n) => n != null)
    .map((name) => name.toLowerCase())
  const otherNamesFilter = (otherName: string) => {
    return (
      otherName != null &&
      !lowerCaseNames.includes(otherName) &&
      !otherNamesExcludeWordFilter.includes(otherName)
    )
  }

  return [...new Set(otherNames)].filter(otherNamesFilter)
}

const parseNames = (productName: string): Names => {
  const hasEdition = productName.includes(':')
  const hasParent = productName.includes('[')

  if (hasEdition) {
    const [actualName, editionName] = productName
      .split(':')
      .map((p) => p.trim())

    return {
      name: actualName,
      editionName,
    }
  }

  if (hasParent) {
    const [actualName, parentName] = productName
      .split('[')
      .map((p) => p.replace(']', '').trim())

    return {
      name: actualName,
      parentName,
    }
  }

  return {
    name: productName,
  }
}
