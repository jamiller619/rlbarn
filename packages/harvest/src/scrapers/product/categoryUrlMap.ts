import { Category } from '@rlbarn/core/dist/enums/CATEGORY.js'
import { RLG } from '../../config.js'

const itemsURL = `${RLG.URL}/items`

export class CategoryMap {
  url: string
  type: Category
  usesSameImageForAllProducts?: string
  hasPaintVariationImages?: boolean
}

/**
 * Map our categories to item category URLs from RLG
 */
export const categoryUrlMap: Array<CategoryMap> = [
  {
    url: `${itemsURL}/antennas`,
    type: Category.ANTENNA,
  },
  {
    url: `${itemsURL}/borders`,
    type: Category.AVATAR_BORDER,
  },
  {
    url: `${itemsURL}/bodies`,
    type: Category.BODY,
    hasPaintVariationImages: true,
  },
  {
    url: `${itemsURL}/decals`,
    type: Category.DECAL,
  },
  {
    url: `${itemsURL}/engines`,
    type: Category.ENGINE_AUDIO,
    usesSameImageForAllProducts: `${RLG.URL}/content/media/items/avatar/220px/engine.png`,
  },
  {
    url: `${itemsURL}/explosions`,
    type: Category.GOAL_EXPLOSION,
  },
  {
    url: `${itemsURL}/paints`,
    type: Category.PAINT_FINISH,
  },
  {
    url: `${itemsURL}/banners`,
    type: Category.PLAYER_BANNER,
  },
  {
    url: `${itemsURL}/boosts`,
    type: Category.ROCKET_BOOST,
  },
  {
    url: `${itemsURL}/toppers`,
    type: Category.TOPPER,
  },
  {
    url: `${itemsURL}/trails`,
    type: Category.TRAIL,
  },
  {
    url: `${itemsURL}/wheels`,
    type: Category.WHEEL,
    hasPaintVariationImages: true,
  },
]
