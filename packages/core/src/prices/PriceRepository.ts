import mongodb from 'mongodb'
import { Price } from './Price.js'
import createRepo, { Repository } from '../Repository.js'

type PriceRepository = Repository<Price> & {
  getPrices(pvId: mongodb.ObjectId): Promise<Price>
}

const priceRepository = createRepo('prices') as PriceRepository

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
