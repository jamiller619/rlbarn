import mongodb from 'mongodb'
import { Product } from './Product.js'
import slugify from '../utils/slugify.js'
import createRepo, { Repository } from '../Repository.js'

type ProductRepository = Repository<Product> & {
  findMatch(
    name: string,
    categoryId: number,
    filter?: mongodb.FilterQuery<Product>
  ): Promise<Product>
}

const productRepository = createRepo('products') as ProductRepository

productRepository.findMatch = async (
  name: string,
  categoryId: number,
  filter?: mongodb.FilterQuery<Product>
): Promise<Product> => {
  const filterQuery = {
    ...filter,
    $text: { $search: name },
    categoryId,
  }

  const sort: mongodb.SortOptionObject<Product> = {
    score: {
      $meta: 'textScore',
    },
  }

  const results = await productRepository
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

export default productRepository
