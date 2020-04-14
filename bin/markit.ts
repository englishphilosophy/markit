import {
  parseArgs,
  red
} from '../deps.ts'
import markit from '../mod.ts'

// parse command line arguments
const args = parseArgs(Deno.args, {
  alias: { c: 'config', d: 'debug', h: 'help', o: 'output', v: 'version' }
})

// show help
if (args.help || (args._.length === 0) && !args.version) {
  markit.help()
}

// or show version
else if (args.version) {
  markit.version()
}

// or try to run markit
else {
  try {
    markit.run(args._[0] as string, args.output, args.config)
  } catch (error) {
    console.log(red(`Error: ${error.message}`))
    if (error.inputFilePath) {
      console.log(red(`Input file path: ${error.inputFilePath}`))
    }
    if (error.textId) {
      console.log(red(`Text ID: ${error.textId}`))
    }
    if (error.blockId) {
      console.log(red(`Block ID: ${error.blockId}`))
    }
    if (args.debug) {
      console.error(error)
    }
  }
}
