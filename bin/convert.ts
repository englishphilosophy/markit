import { dirname, ensureDirSync, existsSync, extname, readJsonSync, writeFileStrSync } from '../deps.ts'
import * as show from './show.ts'
import mits from './mits.ts'
import Options from '../lib/options.ts'
import markit from '../lib/markit.ts'

export default function convert (inputPath: string, outputPath: string|undefined, configPath: string|undefined) {
  // if input path doesn't exist and doesn't end in '.mit', add '.mit'
  if (!existsSync(inputPath) && extname(inputPath) !== '.mit') {
    inputPath += '.mit'
  }

  // check path exists
  if (!existsSync(inputPath)) {
    throw new Error(`File/directory ${inputPath} does not exist.`)
  }

  // get input path stat object
  const inputPathStat = Deno.statSync(inputPath)

  // set output directory path
  const outputDirectoryPath = outputPath || (inputPathStat.isFile() ? dirname(inputPath) : inputPath)

  // initialise default options
  const options = new Options()

  // potentially overwrite with options from markit.config.json
  if (existsSync('markit.config.json')) {
    try {
      const localOptions = readJsonSync('markit.config.json')
      options.load(localOptions)
    } catch (ignore) {
      throw new Error('Invalid markit.config.json file.')
    }
  }

  // potentially overwrite from command line config file
  if (configPath) {
    if (!existsSync(configPath)) {
      throw new Error(`Config file '${configPath}' not found.`)
    }
    try {
      const customOptions = readJsonSync(configPath)
      options.load(customOptions)
    } catch (ignore) {
      throw new Error(`Invalid config file '${configPath}'.`)
    }
  }

  // either convert all markit files in the directory
  if (inputPathStat.isDirectory()) {
    const mitFiles = mits(inputPath)
    show.info(`Found ${mitFiles.length} MIT files in ${inputPath}. Converting...`)
    mitFiles.forEach((inputFilePath) => {
      convertAndSave(inputPath, inputFilePath, outputDirectoryPath, options)
    })
    show.success(`${mitFiles.length} files created.`)
  }

  // or convert single file
  else if (inputPathStat.isFile()) {
    show.info(`Converting MIT file...`)
    convertAndSave(dirname(inputPath), inputPath, outputDirectoryPath, options)
    show.success('File created.')
  }

  // or throw an error
  else {
    throw new Error(`Input path ${inputPath} is not a file or directory.`)
  }
}

function convertAndSave (inputDirectoryPath: string, inputFilePath: string, outputDirectoryPath: string, options: Options) {
  const result = markit(inputFilePath, options)
  const ext = (options.format === 'tei') ? '.xml' : `.${options.format}`
  const outputFilePath = inputFilePath
    .replace(/\.mit$/, ext)
    .replace(new RegExp(`^${inputDirectoryPath}`), outputDirectoryPath)
  ensureDirSync(dirname(outputFilePath))
  writeFileStrSync(outputFilePath, result)
}
