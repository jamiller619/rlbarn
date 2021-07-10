import winston from 'winston'

type Task = () => Promise<void>
type RenderStats = () => string

export default class Scraper {
  title: string
  logger: winston.Logger
  task: Task
  renderStats: RenderStats

  async init(): Promise<void> {
    try {
      this.logger.info(`Starting scrape-${this.title}`)
      await this.task()
    } catch (e) {
      this.logger.error(
        `Error in scrape-${this.title}: ${e?.message}: ${e?.stack}`
      )
    } finally {
      this.logger.info(`\n
Scraping ${this.title} complete!
  
Stats: ${this.renderStats()}`)
    }
  }

  constructor(
    title: string,
    logger: winston.Logger,
    task: Task,
    renderStats: RenderStats
  ) {
    this.title = title.toLowerCase()
    this.task = task
    this.logger = logger
    this.renderStats = renderStats
  }
}
