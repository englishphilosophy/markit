import compile from './src/compile.ts'
import run from './src/run.ts'

export default {
  run,
  compile,
  help: function () {
    console.log('Usage: markit inputPath [-c configFilePath]')
  },
  version: function () {
    console.log('v1.0.0')
  }
}
