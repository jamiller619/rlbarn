#!/usr/bin/env node
import { program } from 'commander'
import banner from './banner.js'
import connect from '@rlbarn/core/dist/database.js'
import productScraper from './scrapers/products/ProductScraper.js'
import priceScraper from './scrapers/prices/PriceScraper.js'

program.option('--products').option('--prices')

const run = async () => {
  console.log(banner)

  const connection = await connect()

  program.parse(process.argv)

  const options = program.opts()

  if (options.products) {
    await productScraper()
  }

  if (options.prices) {
    await priceScraper()
  }

  connection.close()
}

run()
