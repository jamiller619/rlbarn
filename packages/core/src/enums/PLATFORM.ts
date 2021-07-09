import { enumify } from './Enumify.js'

const Enumify = enumify(1)

export class Platform extends Enumify {
  static ALL = new Platform('All')
  static PC = new Platform('PC')
  static PLAYSTATION = new Platform('PlayStation')
  static SWITCH = new Platform('Switch')
  static XBOX = new Platform('Xbox')
}
