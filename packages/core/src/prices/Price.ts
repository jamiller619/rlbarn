import mongodb from 'mongodb'

export type PriceRange = [number, number]

export type BlueprintPrices = {
  pc?: number
  ps?: number
  xbox?: number
  switch?: number
}

export type PriceData = {
  paintId: number
  pc?: PriceRange
  ps?: PriceRange
  xbox?: PriceRange
  switch?: PriceRange
  bp?: BlueprintPrices
}

export type Price = {
  _id: mongodb.ObjectId
  createDate: Date
  pvId: mongodb.ObjectId
  data: PriceData[]
}
