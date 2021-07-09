import { enumify } from './Enumify.js'

const Enumify = enumify(1)

export class Quality extends Enumify {
  static BLACK_MARKET = new Quality('Black Market')
  static COMMON = new Quality('Common')
  static EXOTIC = new Quality('Exotic')
  static IMPORT = new Quality('Import')
  static LEGACY = new Quality('Legacy')
  static LIMITED = new Quality('Limited')
  static PREMIUM = new Quality('Premium')
  static RARE = new Quality('Rare')
  static UNCOMMON = new Quality('Uncommon')
  static VERY_RARE = new Quality('Very Rare')
}
