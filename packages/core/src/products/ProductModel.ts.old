import mongodb from 'mongodb'
import slugify from '../utils/slugify.js'
import { Category, Platform, Quality, SpecialEdition } from '../enums/index.js'
import { ProductDocument, ProductVariationDocument } from './ProductDocument.js'
import BaseModel from '../base/BaseModel.js'

export interface ProductVariation {
  quality: Quality
  productId?: number
  rliId?: number
  rlgId?: number
}

export interface Product {
  updatedAt: Date
  name: string
  otherNames?: string[]
  parentId?: mongodb.ObjectId
  category: Category
  platform?: Platform
  edition?: SpecialEdition
  variations: ProductVariationModel[]
}

export class ProductVariationModel
  extends BaseModel
  implements ProductVariation
{
  quality: Quality
  productId?: number
  rliId?: number
  rlgId?: number

  fromDocument({
    qualityId,
    productId,
    rliId,
    rlgId,
  }: ProductVariationDocument): ProductVariationModel {
    this.quality = Quality.fromValue(qualityId)
    this.productId = productId
    this.rliId = rliId
    this.rlgId = rlgId

    return this
  }

  toDocument(): ProductVariationDocument {
    return {
      _id: this._id,
      qualityId: this.quality.value,
      productId: this.productId,
      rliId: this.rliId,
      rlgId: this.rlgId,
    }
  }
}

export class ProductModel extends BaseModel implements Product {
  updatedAt: Date
  name: string
  otherNames?: string[]
  parentId?: mongodb.ObjectId
  category: Category
  edition?: SpecialEdition
  platform?: Platform
  variations: ProductVariationModel[]

  get slug(): string {
    return slugify(this.name)
  }

  fromDocument({
    name,
    otherNames,
    parent,
    categoryId,
    editionId,
    platformId,
    variations,
  }: ProductDocument): ProductModel {
    this.name = name
    this.otherNames = otherNames
    this.parentId = parent
    this.category = Category.fromValue(categoryId)
    this.edition = SpecialEdition.fromValue(editionId)
    this.platform = Platform.fromValue(platformId)
    this.variations = variations.map((variation) =>
      new ProductVariationModel().fromDocument(variation)
    )

    return this
  }

  toDocument(): ProductDocument {
    return {
      _id: this._id,
      updatedAt: this.updatedAt,
      name: this.name,
      otherNames: this.otherNames,
      parent: this.parentId,
      categoryId: this.category.value,
      editionId: this.edition?.value,
      platformId: this.platform?.value,
      variations: this.variations.map((variation) => variation.toDocument()),
    }
  }
}
