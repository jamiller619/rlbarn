import mongodb, { Collection } from 'mongodb'
import { Price } from './Price.js'
import { getCollection } from '../database.js'

type PriceRepository = Collection<Price> & {
  getPrices(pvId: mongodb.ObjectId): Promise<Price>
}

const priceRepository = getCollection<Price>('prices') as PriceRepository

priceRepository.getPrices = async (pvId: mongodb.ObjectId): Promise<Price> => {
  const results = await priceRepository
    .find({ pvId })
    .sort({ createDate: -1 })
    .limit(1)
    .toArray()

  if (results.length > 0) {
    return results[0]
  }
}

export default priceRepository

/**
 * if (Array.isArray(results) && results.length > 0) {
    const [result] = results

    if (paintIds.length > 0) {
      const data = result.data.filter(({ paintId }) => {
        return paintIds.includes(paintId)
      })

      return {
        ...result,
        data,
      }
    }

    return result
  }
 */

// export class PriceRepository {
//   get collection(): Collection<PriceDocument> {
//     return getCollection<PriceDocument>('prices')
//   }

// async getPrices(
//   pvId: mongodb.ObjectId,
//   ...paintIds: (number | undefined)[]
// ): Promise<PriceDocument> {
//   const results = await this.collection
//     .find({ pvId })
//     .sort({ createDate: -1 })
//     .limit(1)
//     .toArray()

//   if (Array.isArray(results) && results.length > 0) {
//     const [result] = results

//     if (paintIds.length > 0) {
//       const data = result.data.filter(({ paintId }) => {
//         return paintIds.includes(paintId)
//       })

//       return {
//         ...result,
//         data,
//       }
//     }

//     return result
//   }
//   }
// }

// export default new PriceRepository()
