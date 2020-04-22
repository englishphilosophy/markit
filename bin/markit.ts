import {
  existsSync,
  readJsonSync,
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
    let config: any = {}
    if (existsSync('markit.config.json')) {
      try {
        config = readJsonSync('markit.config.json')
      } catch (ignore) {
        throw new Error('Invalid markit.config.json file.')
      }
    }
    if (args.config) {
      if (!existsSync(args.config)) {
        throw new Error(`Config file '${args.config}' not found.`)
      }
      try {
        config = readJsonSync(args.config)
      } catch (ignore) {
        throw new Error(`Invalid config file '${args.config}'.`)
      }
    }
    markit.run(args._[0] as string, args.output, config)
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
