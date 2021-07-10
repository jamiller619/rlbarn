import { PaintColor, Category, Quality } from '@rlbarn/core/dist/enums/index.js'

export const categoryMap = {
  decals: Category.DECAL,
  wheels: Category.WHEEL,
  goalExplosions: Category.GOAL_EXPLOSION,
  cars: Category.BODY,
  boosts: Category.ROCKET_BOOST,
  toppers: Category.TOPPER,
  trails: Category.TRAIL,
  antennas: Category.ANTENNA,
  avatarBorders: Category.AVATAR_BORDER,
  paintFinishes: Category.PAINT_FINISH,
  banners: Category.PLAYER_BANNER,
  engineAudios: Category.ENGINE_AUDIO,
}

export const qualityAttributeMap = {
  blackMarket: Quality.BLACK_MARKET,
  exotic: Quality.EXOTIC,
  import: Quality.IMPORT,
  veryRare: Quality.VERY_RARE,
  rare: Quality.RARE,
  uncommon: Quality.UNCOMMON,
  limited: Quality.LIMITED,
}

export const qualityMap = [
  {
    id: 1,
    quality: Quality.LIMITED,
  },
  {
    id: 3,
    quality: Quality.UNCOMMON,
  },
  {
    id: 4,
    quality: Quality.RARE,
  },
  {
    id: 5,
    quality: Quality.VERY_RARE,
  },
  {
    id: 6,
    quality: Quality.IMPORT,
  },
  {
    id: 7,
    quality: Quality.EXOTIC,
  },
  {
    id: 8,
    quality: Quality.BLACK_MARKET,
  },
]

export const paintColorMap = [
  {
    id: 0,
    paint: PaintColor.REGULAR,
  },
  {
    id: 1,
    paint: PaintColor.BLACK,
  },
  {
    id: 2,
    paint: PaintColor.TITANIUM_WHITE,
  },
  {
    id: 3,
    paint: PaintColor.GREY,
  },
  {
    id: 4,
    paint: PaintColor.CRIMSON,
  },
  {
    id: 5,
    paint: PaintColor.PINK,
  },
  {
    id: 6,
    paint: PaintColor.COBALT,
  },
  {
    id: 7,
    paint: PaintColor.SKY_BLUE,
  },
  {
    id: 8,
    paint: PaintColor.BURNT_SIENNA,
  },
  {
    id: 9,
    paint: PaintColor.SAFFRON,
  },
  {
    id: 10,
    paint: PaintColor.LIME,
  },
  {
    id: 11,
    paint: PaintColor.FOREST_GREEN,
  },
  {
    id: 12,
    paint: PaintColor.ORANGE,
  },
  {
    id: 13,
    paint: PaintColor.PURPLE,
  },
]
