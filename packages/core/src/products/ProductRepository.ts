import mongodb, { InsertWriteOpResult, WithId, Collection } from 'mongodb'
import { ProductModel } from './ProductModel.js'
import { ProductDocument } from './ProductDocument.js'
import { getCollection } from '../database.js'
import slugify from '../utils/slugify.js'

export class ProductRepository {
  get collection(): Collection<ProductDocument> {
    return getCollection<ProductDocument>('products')
  }

  insertMany(
    products: ProductModel[]
  ): Promise<InsertWriteOpResult<WithId<ProductDocument>>> {
    return this.collection.insertMany(
      products.map((product) => product.toDocument())
    )
  }

  find(
    filter?: mongodb.FilterQuery<ProductDocument>,
    projection: mongodb.SchemaMember<ProductDocument, unknown> = {}
  ): Promise<ProductDocument[]> {
    return this.collection.find(filter).project(projection).toArray()
  }

  findOne(
    filter?: mongodb.FilterQuery<ProductDocument>
  ): Promise<ProductDocument> {
    return this.collection.findOne(filter)
  }

  async findMatch(
    name: string,
    categoryId: number,
    filter?: mongodb.FilterQuery<ProductDocument>,
    limit = 1
  ): Promise<ProductModel> {
    const filterQuery = {
      ...filter,
      $text: { $search: name },
      categoryId,
    }

    const sort: mongodb.SortOptionObject<ProductDocument> = {
      score: {
        $meta: 'textScore',
      },
    }

    const results = await this.collection
      .find(filterQuery)
      .sort(sort)
      .limit(limit)
      .toArray()

    if (results.length === 0) {
      throw new Error(`No results found.`)
    }

    if (results.length === 1) {
      return new ProductModel().fromDocument(results[0])
    }

    const resultWithMatchingName = results.find((result) => {
      const namesMatch = result.name === name

      if (!namesMatch) {
        return slugify(result.name) === slugify(name)
      }

      return namesMatch
    })

    return new ProductModel().fromDocument(resultWithMatchingName || results[0])
  }
}

export default new ProductRepository()
