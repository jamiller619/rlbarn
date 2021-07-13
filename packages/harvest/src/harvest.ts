#!/usr/bin/env node
import { program } from 'commander'
import banner from './banner.js'
import scrapeProducts from './scrapers/products/ProductScraper.js'
import scrapePrices from './scrapers/prices/PriceScraper.js'

program.option('--products').option('--prices')

const run = async () => {
  console.log(banner)

  program.parse(process.argv)

  const options = program.opts()

  if (options.products) {
    await scrapeProducts()
  }

  if (options.prices) {
    await scrapePrices()
  }
}

run()
