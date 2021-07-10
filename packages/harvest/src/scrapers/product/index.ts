import path from 'path'
import { JSDOM } from 'jsdom'
import { createLogger } from '@rlbarn/core/dist/logger.js'
import connect from '@rlbarn/core/dist/database.js'
import productRepository from '@rlbarn/core/dist/products/ProductRepository.js'
import { parse } from './parse.js'
import { RLGProduct } from './RLGProduct.js'
import { LOG_PATH, IMAGE_SAVE_PATH } from '../../config.js'
import { categoryUrlMap, CategoryMap } from './categoryUrlMap.js'
import {
  saveImageFromUrl,
  saveFile,
  ErrorStatus,
  timestamp,
} from '../../utils.js'

const logger = createLogger({
  filename: `${LOG_PATH}/rlgarage-${timestamp}.log`,
  label: 'RLG',
})

const stats = {
  productsParsed: 0,
  imagesSaved: 0,
  newRecords: 0,
}

const saveProductImages = async (product: RLGProduct): Promise<void> => {
  const dir = path.resolve(IMAGE_SAVE_PATH, product.imagesSavePath)
  const errorMessages = []

  for await (const image of product.imageUrls) {
    const { url, paint } = image
    const { slug } = paint
    const filename = `${slug}.png`

    try {
      await saveImageFromUrl(url, dir, filename)

      stats.imagesSaved += 1
    } catch (e) {
      if (e?.message === ErrorStatus.FileExists) {
        continue
      }

      errorMessages.push(
        `Encountered error trying to save "${product.name}:  ${paint.name}": RLG ID: ${product.rlgId} @ "${url}"`
      )
    }
  }

  if (errorMessages.length > 0) {
    logger.error(`\n${errorMessages.join('\n')}`)
  }
}

const messages = (categoryName: string) => {
  return {
    PARSING_START: `Parsing started for "${categoryName}"`,
    NO_DATA: `No new data for ${categoryName}, moving on`,
    SAVING_IMAGES: `Saving images for: ${categoryName}`,
    SAVING_DATA: `Saving data for: "${categoryName}"`,
    FINISH: (productsLen: number) =>
      `Finished with ${categoryName}: Inserted ${productsLen} records.`,
  }
}

const getProductsByRLGId = (categoryId: number) => {
  return productRepository
    .find({ categoryId })
    .project({ 'variations.rlgId': 1 })
    .toArray()
}

const scrapeCategory = async (categoryMap: CategoryMap): Promise<void> => {
  const { type, url, usesSameImageForAllProducts, hasPaintVariationImages } =
    categoryMap
  const filename = (ext: string) => `rlg-${type.name}.${ext}`
  const message = messages(type.name)

  logger.info(message.PARSING_START)

  /**
   * Get a list of all products by RLG id we already have
   * saved to our database for this category.
   */
  const currentProductsList = await getProductsByRLGId(type.value)
  const currentListByRLGId = currentProductsList
    .map((product) => product.variations.map((variation) => variation.rlgId))
    .flat()

  /**
   * Fetch page from RLG website
   */
  const dom = await JSDOM.fromURL(url)

  /**
   * Parse HTML response into RLGProducts
   */
  const parsed = await parse(type, dom.window.document, hasPaintVariationImages)

  /**
   * Filter out products already in our database, and "Team
   * Edition" items
   */
  const products = parsed.filter(
    (product) =>
      product.isTeamEdition === false &&
      currentListByRLGId.includes(product.rlgId) === false
  )

  /**
   * Count the result and if nothing new, proceed to next category
   */
  stats.productsParsed += products.length

  if (products.length === 0) {
    logger.info(message.NO_DATA)

    return
  }

  /**
   * Save product images
   *
   * Some categories use the same image for every product,
   * and is marked as such in the data map. Currently only
   * applies to Engine Audio.
   */
  logger.info(message.SAVING_IMAGES)

  if (usesSameImageForAllProducts) {
    await saveImageFromUrl(
      usesSameImageForAllProducts,
      path.resolve(IMAGE_SAVE_PATH),
      `${type.slug}.png`
    )
  } else {
    await Promise.all(products.map((product) => saveProductImages(product)))
  }

  /**
   * Map RLGProducts to ProductModels for saving to
   * database. We also save a json copy to disk (in logs).
   */
  logger.info(message.SAVING_DATA)

  const data = JSON.stringify(products, null, 2)

  await saveFile(data, LOG_PATH, filename('json'))
  await productRepository.insertMany(
    products.map((product) => product.toDocument())
  )

  stats.newRecords += products.length

  logger.info(message.FINISH(products.length))
}

const scrape = async (): Promise<void> => {
  const connection = await connect()

  try {
    for await (const categoryMap of categoryUrlMap) {
      await scrapeCategory(categoryMap)
    }
  } catch (e) {
    logger.error(`Error in scrapeProducts: ${e?.message}: ${e?.stack}`)
  } finally {
    logger.info(`
      Scraping items complete! Stats:
      ${stats.productsParsed} products parsed
      ${stats.imagesSaved} images saved
      ${stats.newRecords} records added
    `)

    connection.close()
  }
}

scrape()
