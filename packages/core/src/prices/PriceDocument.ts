import mongodb from 'mongodb'

export type PriceRange = [number, number]

export type BlueprintPricesDocument = {
  pc?: number
  ps?: number
  xbox?: number
  switch?: number
}

export type PriceDataDocument = {
  paintId: number
  pc?: PriceRange
  ps?: PriceRange
  xbox?: PriceRange
  switch?: PriceRange
  bp?: BlueprintPricesDocument
}

export type PriceDocument = {
  _id: mongodb.ObjectId
  createDate: Date
  pvId: mongodb.ObjectId
  data: PriceDataDocument[]
}
