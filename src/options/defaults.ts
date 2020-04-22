import { Options } from '../types.ts'
import { tei } from './rules.ts'

const defaults: Options = {
  format: 'tei',
  extension: 'xml',
  textFormat: 'full',
  textStubProperties: [],
  maximumDepth: -1,
  contentFormat: 'tei',
  rules: tei,
  createLogFile: false
}

export default defaults
