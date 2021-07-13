import { MongoClient, Collection } from 'mongodb'

export default class Repository<T> {
  collection: Collection<T>

  constructor(client: MongoClient, collectionName: string) {
    this.collection = client.db('rlbarnDB').collection(collectionName)
  }
}
