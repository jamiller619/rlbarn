import { ObjectID, Collection } from 'mongodb'

export type ProductCollection = Collection<Product>

export type ProductVariation = {
  _id: ObjectID
  qualityId: number
  productId?: number
  rliId?: number
  rlgId?: number
}

/**
 * In an ideal world we would be able to predictably
 * generate JSON schemas from these "Document" classes, but
 * as of 07/21 I haven't found a solution that can do it
 * without issue, and the only other solution is to roll my
 * own = total overkill. So, manually keeping track of
 * changes between the various files.
 */
export type Product = {
  _id: ObjectID
  updatedAt: Date
  name: string
  otherNames?: string[]
  parent?: ObjectID
  categoryId: number
  editionId?: number
  platformId?: number
  variations: ProductVariation[]
}
