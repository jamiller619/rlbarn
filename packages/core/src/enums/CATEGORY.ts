import { enumify } from './Enumify.js'

const Enumify = enumify(1)

export class Category extends Enumify {
  static ANTENNA = new Category('Antenna')
  static AVATAR_BORDER = new Category('Avatar Border')
  static BLUEPRINT = new Category('Blueprint')
  static BODY = new Category('Body')
  static DECAL = new Category('Decal')
  static ENGINE_AUDIO = new Category('Engine Audio')
  static GOAL_EXPLOSION = new Category('Goal Explosion')
  static PAINT_FINISH = new Category('Paint Finish')
  static PLAYER_ANTHEM = new Category('Player Anthem')
  static PLAYER_BANNER = new Category('Player Banner')
  static PLAYER_TITLE = new Category('Player Title')
  static ROCKET_BOOST = new Category('Rocket Boost')
  static TOPPER = new Category('Topper')
  static TRAIL = new Category('Trail')
  static WHEEL = new Category('Wheel')
}
