import path from 'path'

export const DB_URI = process.env.DB_URI

export const RLG = {
  URL: 'https://rocket-league.com',
}

export const RLI = {
  URL: 'https://rl.insider.gg/pc',
}

export const LOG_PATH = path.resolve(process.cwd(), process.env.LOG_PATH)

export const IMAGE_SAVE_PATH = path.resolve(
  process.cwd(),
  process.env.IMAGE_SAVE_PATH
)
