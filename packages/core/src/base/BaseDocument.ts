import mongodb from 'mongodb'

export type BaseDocument = {
  _id: mongodb.ObjectId
}
