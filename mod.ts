import compile from './src/compile.ts'
import run from './src/run.ts'
import json from './src/compile/json.ts'
import content from './src/compile/json/content.ts'

export default {
  run,
  compile,
  json,
  content,
  help: function () {
    console.log('Usage: markit inputPath [-c configFilePath]')
  },
  version: function () {
    console.log('v1.0.0')
  }
}
