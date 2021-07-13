import path from 'path'

export const timestamp = (() => {
  const date = Date.now()
  const [m, d, y] = new Date(date).toLocaleDateString('en-US').split('/')

  return [m.padStart(2, '0'), d.padStart(2, '0'), y, date].join('-')
})()

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const DB_URI = process.env.DB_URI
export const RLG = {
  URL: 'https://rocket-league.com',
}
export const RLI = {
  URL: 'https://rl.insider.gg/pc',
}
export const LOG_PATH = path.resolve(
  process.cwd(),
  process.env.LOG_PATH,
  timestamp
)
export const IMAGE_SAVE_PATH = path.resolve(
  process.cwd(),
  process.env.IMAGE_SAVE_PATH
)
