import compile from './src/compile.ts'
import run from './src/run.ts'
import content from './src/compile/content.ts'

export default {
  run,
  compile,
  content,
  help: function () {
    console.log('Usage: markit inputPath [-c configFilePath]')
  },
  version: function () {
    console.log('v1.0.0')
  }
}
