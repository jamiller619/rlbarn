import { FilterQuery, SortOptionObject } from 'mongodb'
import Repository from '../Repository.js'
import { Product } from './Product.js'
import slugify from '../utils/slugify.js'

export default class ProductRepository extends Repository<Product> {
  async findMatch(
    name: string,
    categoryId: number,
    filter?: FilterQuery<Product>
  ): Promise<Product> {
    const filterQuery = {
      ...filter,
      $text: { $search: name },
      categoryId,
    }

    const sort: SortOptionObject<Product> = {
      score: {
        $meta: 'textScore',
      },
    }

    const results = await this.collection
      .find(filterQuery)
      .sort(sort)
      .limit(5)
      .toArray()

    if (results.length === 0) {
      return
    }

    if (results.length === 1) {
      return results[0]
    }

    const resultWithMatchingName = results.find((result) => {
      const namesMatch = result.name === name

      if (!namesMatch) {
        return slugify(result.name) === slugify(name)
      }

      return namesMatch
    })

    return resultWithMatchingName || results[0]
  }
}
