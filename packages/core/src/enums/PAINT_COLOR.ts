import { enumify } from './Enumify.js'

const Enumify = enumify(1)

export class PaintColor extends Enumify {
  static BLACK = new PaintColor('Black')
  static BURNT_SIENNA = new PaintColor('Burnt Sienna')
  static COBALT = new PaintColor('Cobalt')
  static CRIMSON = new PaintColor('Crimson')
  static FOREST_GREEN = new PaintColor('Forest Green')
  static GREY = new PaintColor('Grey')
  static LIME = new PaintColor('Lime')
  static ORANGE = new PaintColor('Orange')
  static PINK = new PaintColor('Pink')
  static PURPLE = new PaintColor('Purple')
  static REGULAR = new PaintColor('Regular')
  static SAFFRON = new PaintColor('Saffron')
  static SKY_BLUE = new PaintColor('Sky Blue')
  static TITANIUM_WHITE = new PaintColor('Titanium White')
}
