import { enumify } from './Enumify.js'

const Enumify = enumify(1)

/**
 * Editions ONLY apply to Wheels
 *
 * The values are taken directly from RLGarage, however,
 * according to Rocket League (https://bit.ly/3pMCVSM),
 * there are only four special edition types:
 *    Infinite
 *    Holographic
 *    Inverted
 *    Remixed
 * This can be seen in the "FILTERS" dropdown in-game, in
 * the item's "hover card" with the "SPECIAL EDITION" label,
 * and in the item's name. i.e. RL Special Edition items
 * don't have the edition in the item's name. But, since
 * there are only a few RL Special Edition items, we are
 * going to treat them all the same, which is how RLG and
 * RLI both handle this attribute.
 *
 * I don't know what "5" should refer to, or why it's
 * missing from RLG, but as of 05/2021 there is nothing in
 * their item database with this edition id.
 */
export class SpecialEdition extends Enumify {
  static HOLOGRAPHIC = new SpecialEdition('Holographic')
  static INFINITE = new SpecialEdition('Infinite')
  static INVERTED = new SpecialEdition('Inverted')
  static REMIXED = new SpecialEdition('Remixed')
  static RADIANT = new SpecialEdition('Radiant')
  static HATCH = new SpecialEdition('Hatch')
  static SACRED = new SpecialEdition('Sacred')
  static OBVERSE = new SpecialEdition('Obverse')
}
