import { parseArgs } from '../deps.ts'
import * as show from './show.ts'
import convert from './convert.ts'

// parse command line arguments
const args = parseArgs(Deno.args, {
  alias: { c: 'config', d: 'debug', h: 'help', o: 'output', v: 'version' }
})

// maybe show help (and exit)
if (args.help || (args._.length === 0) && !args.version) {
  show.header()
  show.help()
}

// maybe show version (and exit)
else if (args.version) {
  show.version()
}

// otherwise try to run markit
else {
  show.header()
  try {
    convert(args._[0] as string, args.output, args.config)
  } catch (error) {
    if (args.debug) {
      console.error(error)
    } else {
      show.error(error)
    }
  }
}
