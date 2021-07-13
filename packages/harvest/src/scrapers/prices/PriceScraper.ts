import { JSDOM } from 'jsdom'
import ora from 'ora'
import db from '@rlbarn/core/dist/database.js'
import { createLogger } from '@rlbarn/core/dist/logger.js'
import { Product } from '@rlbarn/core/dist/products/Product.js'
import { RLI, LOG_PATH } from '../../config.js'
// import { saveFile } from '../../utils.js'
import { RLIProduct } from './RLIProduct.js'
import Scraper from '../Scraper.js'
// import { Category } from '@rlbarn/core/dist/enums/index.js'

const logger = createLogger({
  filename: `${LOG_PATH}/prices.rlinsider.log`,
  label: 'RLI',
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

const stats: Stats = {
  parsed: 0,
  saved: 0,
  itemsWithMatch: 0,
  itemsWithoutMatch: 0,
}

const updateProduct = async (
  product: Product,
  model: RLIProduct
): Promise<string> => {
  const variation =
    product.variations.length > 1
      ? product.variations.find(
          (variation) => variation.qualityId === model.quality.value
        )
      : product.variations[0]

  // We have a brand new variation
  if (variation == null) {
    const newVariation = model.toDocumentVariation()

    await db.productRepository.collection.updateOne(
      { _id: product._id },
      {
        $push: {
          variations: newVariation,
        },
        $set: {
          updatedAt: new Date(),
          otherNames: model.otherNames,
        },
      }
    )

    return newVariation._id.toHexString()
  }

  const filter = {
    _id: product._id,
    'variations._id': variation._id,
  }

  const updateDoc = {
    $set: {
      updatedAt: new Date(),
      otherNames: model.otherNames,
      'variations.$.rliId': model.rliId,
    },
  }

  await db.productRepository.collection.updateOne(filter, updateDoc)

  return variation._id.toHexString()
}

const findMatch = async (model: RLIProduct): Promise<Product> => {
  const byId = await db.productRepository.collection.findOne({
    'variations.rliId': model.rliId,
  })

  if (byId != null) {
    return byId
  }

  const match = await db.productRepository.findMatch(
    model.name,
    model.category.value,
    {
      editionId: model.edition?.value,
    }
  )

  return match == null ? undefined : match
}

const saveData = async (models: RLIProduct[]): Promise<void> => {
  const withMatch = []
  const withoutMatch = []
  const logErrors = []
  const spinner = ora().start()
  const total = models.length
  let current = 0

  for await (const model of models) {
    const pct = Math.ceil((current / models.length) * 100)
    spinner.text = `${pct.toString().padStart(3, ' ')}%: ${current
      .toString()
      .padStart(5, ' ')} of ${total}`

    current += 1

    const { rliId, nameWithEdition } = model
    const match = await findMatch(model)

    if (match != null) {
      stats.itemsWithMatch += 1

      model.pvId = await updateProduct(match, model)

      withMatch.push(model)
    } else {
      stats.itemsWithoutMatch += 1
      withoutMatch.push(model)

      logErrors.push(
        `Unable to find a match for RLI Id ${rliId}: "${nameWithEdition}"`
      )
    }
  }

  if (logErrors.length > 0) {
    logger.error(logErrors)
  }

  const docs = withMatch.map((match) => match.toDocument())

  // await saveFile(withMatch, LOG_PATH, 'with-matches.json')
  // await saveFile(withoutMatch, LOG_PATH, 'without-matches.json')

  const response = await db.priceRepository.collection.insertMany(docs)

  stats.saved = response.insertedCount
}

const scrape = async (): Promise<void> => {
  const dom = await JSDOM.fromURL(RLI.URL)
  const models = parse(dom.window.document).filter(
    (model) => model.category != null
  )

  stats.parsed = models.reduce((total, model) => {
    return total + model.prices.length
  }, 0)

  await saveData(models)
}

const renderStats = () => {
  return `
  ${stats.parsed} prices parsed
  ${stats.saved} records saved
  ${stats.itemsWithMatch} items WITH a match
  ${stats.itemsWithoutMatch} items WITHOUT a match
  `
}

const scraper = new Scraper('prices', logger, scrape, renderStats)

export default scraper.init.bind(scraper)
