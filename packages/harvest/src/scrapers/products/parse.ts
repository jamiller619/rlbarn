import { Category } from '@rlbarn/core/dist/enums/index.js'
import productRepository from '@rlbarn/core/dist/products/ProductRepository.js'
import { RLGProduct } from './RLGProduct.js'

type ItemsGroup = {
  parentId?: string
  parentName?: string
  items: Element[]
}

type DOMContext = Document | Element

const nextUntil = (startEl: Element, stopEl: Element): Element[] => {
  const siblings: Element[] = []

  while (
    (!stopEl || startEl.nextElementSibling !== stopEl) &&
    (startEl = startEl.nextElementSibling)
  ) {
    siblings.push(startEl)
  }

  return siblings
}

/**
 * RLG divides their decals page into two sections, both
 * with the '.rlg-items-grid' class. The first section are
 * the "Universal" decals while the second are non-global
 * decals that apply only to a specific body.
 */
const evaluateDecalsPage = async (
  context: DOMContext
): Promise<ItemsGroup[]> => {
  const headers = context.querySelectorAll('.rlg-items-grid > h2')
  const results = []
  let i = 0

  for await (const header of headers) {
    const parentName = header.textContent.trim()
    const result: ItemsGroup = {
      items: [],
    }

    if (parentName != null && parentName !== '') {
      const parent = await productRepository.findOne({
        categoryId: Category.BODY.value,
        $text: {
          $search: parentName,
        },
      })

      result.parentId = parent?._id?.toHexString()

      if (result.parentId != null) {
        result.parentName = parentName
      }
    }

    result.items = nextUntil(header, headers[i + 1])

    i += 1

    results.push(result)
  }

  return results
}

const parseCategory = async (
  category: Category,
  context: DOMContext
): Promise<ItemsGroup[]> => {
  if (category.value === Category.DECAL.value) {
    return evaluateDecalsPage(context)
  }

  const items = Array.from(
    context.querySelectorAll(
      '#item-display-area .rlg-item__container:not([data-group-owner="true"])'
    )
  )

  return [{ items }]
}

export const parse = async (
  category: Category,
  context: DOMContext,
  hasPaintVariationImages = false
): Promise<RLGProduct[]> => {
  const results: RLGProduct[] = []
  const groups = await parseCategory(category, context)

  return groups.reduce((results, group) => {
    const products = group.items.map(
      (item) =>
        new RLGProduct(
          item as HTMLElement,
          category,
          hasPaintVariationImages,
          group.parentId,
          group.parentName
        )
    )

    return [...results, ...products]
  }, results)
}
