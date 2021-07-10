import { Collection } from 'mongodb'
import { getCollection } from './database.js'

export type Repository<T> = Collection<T> & {
  collection: Collection<T>
}

export default <T>(collectionName: string): Repository<T> => {
  return {
    get collection(): Collection<T> {
      return getCollection<T>(collectionName)
    },
  } as Repository<T>
}
