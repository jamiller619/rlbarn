import mongodb, { Collection } from 'mongodb'
import { PriceDocument } from './PriceDocument.js'
import { PriceModel } from './PriceModel.js'
import { getCollection } from '../database.js'

export class PriceRepository {
  get collection(): Collection<PriceDocument> {
    return getCollection<PriceDocument>('prices')
  }

  async getPrices(
    pvId: mongodb.ObjectId,
    ...paintIds: (number | undefined)[]
  ): Promise<PriceModel> {
    const results = await this.collection
      .find({ pvId })
      .sort({ createDate: -1 })
      .limit(1)
      .toArray()

    if (Array.isArray(results) && results.length > 0) {
      const [result] = results

      if (paintIds.length > 0) {
        const data = result.data.filter(({ paintId }) => {
          return paintIds.includes(paintId)
        })

        return new PriceModel().fromDocument({
          ...result,
          data,
        })
      }

      return new PriceModel().fromDocument(result)
    }
  }
}

export default new PriceRepository()
