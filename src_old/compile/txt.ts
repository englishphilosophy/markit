import { Options } from '../options.ts'

export default function txt (json: any, config: any = {}): string {
  // initialise options
  const options = (config instanceof Options) ? config : new Options(config)

  return 'txt: todo'
}
