import {
  PaintColor,
  SpecialEdition,
  Quality,
  Platform,
  Category,
} from '@rlbarn/core/dist/enums/index.js'
import {
  ProductModel,
  ProductVariationModel,
} from '@rlbarn/core/dist/products/index.js'
import slugify from '@rlbarn/core/dist/utils/slugify.js'
import { toObjectId } from '@rlbarn/core/dist/database.js'
import { RLG } from '../../config.js'
import { replaceSpacesInString } from './utils.js'

const BASE_IMAGE_URL = `${RLG.URL}/content/media/items/avatar/220px`

export type PaintImage = {
  paint: PaintColor
  url: string
}

export type ProductParent = {
  id: string
  name: string
}

const productComparer = (a: RLGProduct, b: ProductModel) => {
  return (
    a.category.value === b.category.value &&
    a.edition?.value === b.edition?.value &&
    a.name === b.name
  )
}

export class RLGProduct {
  /**
   * The container item element
   */
  el: HTMLElement
  /**
   * The data attribute of the container. We can get some
   * information, but most comes from other sources
   */
  data: Record<string, string>
  updatedAt: Date
  category: Category
  name: string
  slug: string
  parentId?: string
  parentName?: string
  hasPaintVariationImages: boolean

  constructor(
    el: HTMLElement,
    category: Category,
    hasPaintVariationImages = false,
    parentId?: string,
    parentName?: string
  ) {
    this.el = el
    this.data = this.el.dataset
    this.category = category

    if (parentId != null && parentName != null) {
      this.parentId = parentId
      this.parentName = parentName
    }

    this.hasPaintVariationImages = hasPaintVariationImages

    const { name } = this.data

    if (name == null) {
      throw new Error(`RLGProduct.name cannot be undefined.`)
    }

    this.name = name
    this.slug = slugify(name)
  }

  get rlgId(): number {
    const target = this.el.querySelector('.rlg-items-item') as HTMLElement

    if (target?.dataset?.id) {
      return Number(target.dataset.id)
    }
  }

  get defaultImage(): string {
    return this.el.querySelector('img')?.src
  }

  /**
   * RLG formats their URLs like so:
   * /content/media/items/avatar/220px/{name}{editionId?}/{name}-{paint}.png
   * where name is lowercase, but paint is TitleCase, and
   * both have all spaces removed.
   *
   * This method will always return at least one image, for
   * for the "default" paint
   */
  get imageUrls(): PaintImage[] {
    const hasPaints = this.data.hascolors === 'true'

    if (!hasPaints || !this.hasPaintVariationImages) {
      const defaultImage = {
        paint: PaintColor.REGULAR,
        url: this.defaultImage,
      }

      return [defaultImage]
    }

    const nameUrl = replaceSpacesInString(this.name.toLowerCase()).replace(
      "'",
      ''
    )

    return PaintColor.enums().map((paint) => {
      const urlPaintName = replaceSpacesInString(paint.name)
      const urlParts = [
        BASE_IMAGE_URL,
        `${nameUrl}${this.edition?.value || ''}`,
        `${nameUrl}-${urlPaintName}`,
      ].filter((part) => part != null)

      return {
        paint,
        url: encodeURI(`${urlParts.join('/')}.png`),
      }
    })
  }

  /**
   * This will be from the overall root folder for all
   * images, to the root folder for images for this product,
   * i.e. "/bodies/Octane/"
   */
  get imagesSavePath(): string {
    const { slug, category, edition, parentName } = this
    const parentSlug = slugify(parentName)

    const path = [category.slug, parentSlug, slug].join('/')

    if (edition != null) {
      return `${path}-${edition.slug}`
    }

    return path
  }

  get edition(): SpecialEdition {
    const id = this.data.edition

    if (id != null && id !== '') {
      return SpecialEdition.fromValue(Number(id))
    }
  }

  get quality(): Quality {
    const qualityName = this.data.rarity

    return Quality.enums().find(({ name }) => name === qualityName)
  }

  /**
   * I don't know what the difference is between RLG's
   * "0" and "All" here, but we're treating both as "All"
   *
   * Also, we're using "startsWith" for PlayStation since
   * RLG includes the version of the PlayStation in their
   * data attribute, i.e. PS4
   */
  get platform(): Platform {
    const platformName = this.data.platform?.toUpperCase()

    if (platformName === '0' || platformName === 'ALL') {
      return Platform.ALL
    }

    if (platformName.startsWith('PS')) {
      return Platform.PLAYSTATION
    }

    return Platform[platformName]
  }

  get isTeamEdition(): boolean {
    return this.data.hasteams === 'true'
  }

  toModel(): ProductModel {
    const productVariation = new ProductVariationModel()

    productVariation.quality = this.quality
    productVariation.rlgId = this.rlgId

    const product = new ProductModel()

    product.name = this.name
    product.category = this.category
    product.platform = this.platform
    product.edition = this.edition

    if (this.parentId != null) {
      product.parentId = toObjectId(this.parentId)
    }

    product.variations = [productVariation]

    return product
  }

  static toModels(products: RLGProduct[]): ProductModel[] {
    const results: ProductModel[] = []

    return products.reduce((results, product) => {
      const matchIndex = results.findIndex((result) =>
        productComparer(product, result)
      )

      if (matchIndex > -1) {
        results[matchIndex].variations.push(...product.toModel().variations)

        return results
      }

      return [...results, product.toModel()]
    }, results)
  }
}
