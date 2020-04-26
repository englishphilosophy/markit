import {
  dirname,
  ensureDirSync,
  writeFileStrSync
} from '../../deps.ts'
import { Options } from '../options.ts'
import compile from '../compile.ts'

export default function conmpileAndSave (
  inputDirectoryPath: string,
  inputFilePath: string,
  outputDirectoryPath: string,
  options: Options
) {
  const result = compile(inputFilePath, options)
  const outputFilePath = inputFilePath
    .replace(/\.mit$/, `.${options.extension}`)
    .replace(new RegExp(`^${inputDirectoryPath}`), outputDirectoryPath)
  ensureDirSync(dirname(outputFilePath))
  writeFileStrSync(outputFilePath, result)
}
  