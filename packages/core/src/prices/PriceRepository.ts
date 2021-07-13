import { ObjectID } from 'mongodb'
import Repository from '../Repository.js'
import { Price } from './Price.js'

export default class PriceRepository extends Repository<Price> {
  async getPrices(pvId: ObjectID): Promise<Price> {
    const results = await this.collection
      .find({ pvId })
      .sort({ createDate: -1 })
      .limit(1)
      .toArray()

    if (results.length > 0) {
      return results[0]
    }
  }
}
