import mongodb, { MongoClient, ObjectID } from 'mongodb'
import ProductRepository from './products/ProductRepository.js'
import PriceRepository from './prices/PriceRepository.js'

const uri = process.env.DB_URI

export const toObjectId = (str: string): ObjectID => {
  return str != null && str !== '' ? new mongodb.ObjectID(str) : undefined
}

export const createObjectId = (): ObjectID => {
  return new mongodb.ObjectID()
}

class Database {
  client: MongoClient
  #priceRepository: PriceRepository
  #productRepository: ProductRepository

  constructor() {
    this.client = new mongodb.MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }

  get priceRepository(): PriceRepository {
    if (this.#priceRepository != null) {
      return this.#priceRepository
    }

    if (!this.client.isConnected()) {
      return
    }

    return (this.#priceRepository = new PriceRepository(this.client, 'prices'))
  }

  get productRepository(): ProductRepository {
    if (this.#productRepository != null) {
      return this.#productRepository
    }

    if (!this.client.isConnected()) {
      return
    }

    return (this.#productRepository = new ProductRepository(
      this.client,
      'products'
    ))
  }
}

export default new Database()

// export default async function connect(): Promise<Database> {
//   if (!db.client.isConnected()) {
//     await db.client.connect()
//   }

//   return db
// }
