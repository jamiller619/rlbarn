import mongodb from 'mongodb'

const { MongoClient } = mongodb
const uri = process.env.DB_URI

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export class Connection {
  close: () => Promise<void>

  constructor(client: mongodb.MongoClient) {
    this.close = () => client.close()
  }
}

export const toObjectId = (str: string): mongodb.ObjectId => {
  return str != null && str !== '' ? new mongodb.ObjectId(str) : undefined
}

export const createObjectId = (): mongodb.ObjectId => {
  return new mongodb.ObjectId()
}

export const getCollection = <T>(
  collectionName: string
): mongodb.Collection<T> => {
  return client.db('rlbarnDB').collection(collectionName)
}

export default async function connect(): Promise<Connection> {
  if (!client.isConnected()) {
    await client.connect()
  }

  return new Connection(client)
}
