import mongodb from 'mongodb'

export default abstract class BaseModel {
  #id = new mongodb.ObjectId()

  get id(): string {
    return this.#id.toHexString()
  }

  get _id(): mongodb.ObjectId {
    return this.#id
  }

  set _id(value: mongodb.ObjectId) {
    this.#id = value
  }
}
