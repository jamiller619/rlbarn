import fs from 'fs'
import util from 'util'
import path from 'path'
import axios from 'axios'

const mkdir = util.promisify(fs.mkdir)
const writeFile = util.promisify(fs.writeFile)

export const ErrorStatus = {
  FileExists: 'File already exists',
}

const doesFileExist = (file: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => resolve(err == null))
  })
}

export const saveFile = async (
  data: unknown,
  dir: string,
  filename: string
): Promise<void> => {
  try {
    const json = JSON.stringify(data, null, 2)

    await mkdir(dir, { recursive: true })

    await writeFile(`${dir}/${filename}`, json)
  } catch (e) {
    throw new Error(`Error in "saveFile": Unable to save file: "${filename}"`)
  }
}

export const saveImageFromUrl = async (
  url: string,
  dir: string,
  filename = path.basename(url),
  overwrite = false
): Promise<void> => {
  const resolvedPath = path.resolve(process.cwd(), dir, filename)

  await mkdir(dir, { recursive: true })

  const fileExists = await doesFileExist(resolvedPath)

  if (fileExists === true && overwrite === false) {
    throw new Error(ErrorStatus.FileExists)
  }

  const writer = fs.createWriteStream(resolvedPath)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', (e) => {
      const error = new Error(
        `Error in "saveImageFromUrl": Unable to save file "${filename}" from url: "${url}": ${e?.message}`
      )

      reject(error)
    })
  })
}
