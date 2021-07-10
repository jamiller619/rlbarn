import { JSDOM } from 'jsdom'
import { createLogger } from '@rlbarn/core/dist/logger.js'
import connect from '@rlbarn/core/dist/database.js'
import {
  Product,
  ProductVariation,
} from '@rlbarn/core/dist/products/Product.js'
import productRepository from '@rlbarn/core/dist/products/ProductRepository.js'
import priceRepository from '@rlbarn/core/dist/prices/PriceRepository.js'
import { RLI, LOG_PATH } from '../../config.js'
import { timestamp } from '../../utils.js'
import { RLIProduct } from './RLIProduct.js'

const logger = createLogger({
  filename: `${LOG_PATH}/rlgarage-${timestamp}.log`,
  label: 'RLG',
})

const parse = (dom: Element | Document): RLIProduct[] => {
  const items = dom.querySelectorAll('.priceTable .itemRow:not(.emptyCell)')

  return Array.from(items).map((item) =>
    new RLIProduct().fromElement(item as HTMLElement)
  )
}

type Stats = {
  parsed: number
  saved: number
  itemsWithoutMatch: number
  itemsWithMatch: number
}

const saveData = async (models: RLIProduct[]): Promise<void> => {
  const stats: Stats = {
    parsed: models.reduce((total, model) => {
      return total + model.data.length
    }, 0),
    saved: 0,
    itemsWithMatch: 0,
    itemsWithoutMatch: 0,
  }

  for await (const model of models) {
    const { rliId, nameWithEdition } = model
    const match = await findMatchAndUpdate(model)

    if (match == null) {
      stats.itemsWithoutMatch += 1

      logger.error(
        `Unable to find a match for RLI Id ${rliId}: "${nameWithEdition}"`
      )

      continue
    }

    stats.itemsWithMatch += 1

    await priceRepository.insertOne(model.toDocument())
  }
}

const updateMatch = async (
  match: Product,
  variation: ProductVariation,
  model: RLIProduct
): Promise<void> => {
  await productRepository.updateOne(
    {
      _id: match._id,
      'variations._id': variation._id,
    },
    {
      updatedAt: new Date(),
      otherNames: model.otherNames,
      $set: {
        'variations.$.rliId': model.rliId,
      },
    }
  )
}

const findMatchAndUpdate = async (
  model: RLIProduct
): Promise<ProductVariation> => {
  const byId = await productRepository.findOne({
    'variations.rliId': model.rliId,
  })

  if (byId != null) {
    return byId.variations.find((variation) => variation.rliId === model.rliId)
  }

  const match = await productRepository.findMatch(
    model.name,
    model.category.value,
    {
      editionId: model.edition?.value,
    }
  )

  if (match == null) return

  const variation =
    match.variations.length > 1
      ? match.variations.find(
          (variation) => variation.qualityId === model.quality.value
        )
      : match.variations[0]

  await updateMatch(match, variation, model)

  return variation
}

const scrape = async () => {
  const connection = await connect()

  try {
    logger.info('Starting scrape prices')

    const dom = await JSDOM.fromURL(RLI.URL)
    const models = parse(dom.window.document).filter(
      (model) => model.category != null
    )

    await saveData(models)
  } catch (e) {
    logger.error(`Error in scrape prices: "${e?.message}"`)
  } finally {
    logger.info('Scraping prices complete!')

    connection.close()
  }
}

scrape()
