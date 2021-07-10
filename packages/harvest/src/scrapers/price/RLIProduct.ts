import {
  Category,
  PaintColor,
  Quality,
  SpecialEdition,
} from '@rlbarn/core/dist/enums/index.js'
import { PriceData, Price } from '@rlbarn/core/dist/prices/Price.js'
import { toObjectId, createObjectId } from '@rlbarn/core/dist/database.js'
import {
  categoryMap,
  qualityMap,
  qualityAttributeMap,
  paintColorMap,
} from './map.js'

export class RLIProduct {
  el: HTMLElement
  rliId: number
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
      data: this.data.map((data) => {
        return {
          paintId: data.paint.value,
          ...data.prices,
        }
      }),
    }
  }

  fromElement(el: HTMLElement): RLIProduct {
    this.el = el

    const itemName = el.dataset['itemname']
    const itemFullName = el.dataset['itemfullname']

    Object.assign(this, parseNames(itemName, itemFullName))

    return this
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
      this.editionName?.trim() !== ''
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

  get data(): DataInfo[] {
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

    return {
      rliId: data.i,
      paint: paintColorMap.find(({ id }) => id === data.p).paint,
      quality: qualityMap.find(({ id }) => id === data.r).quality,
      prices: {
        pc,
        ps,
        xbox,
        switch: data.k.switch,
        bp: data.bp,
      },
    }
  }
}

type Names = {
  name: string
  otherNames: string[]
  editionName?: string
  parentName?: string
}

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
const parseNames = (itemName = '', itemFullName = ''): Names => {
  const otherNames = itemName.split(' ').filter((name) => name != null)

  const hasEdition = itemFullName.includes(':')
  const hasParent = itemFullName.includes('[')

  if (hasEdition) {
    const [actualName, editionName] = itemFullName
      .split(':')
      .map((p) => p.trim())

    return {
      name: actualName,
      otherNames,
      editionName,
    }
  }

  if (hasParent) {
    const [actualName, parentName] = itemFullName
      .split('[')
      .map((p) => p.replace(']', '').trim())

    return {
      name: actualName,
      otherNames,
      parentName,
    }
  }

  return {
    name: itemFullName,
    otherNames,
  }
}
