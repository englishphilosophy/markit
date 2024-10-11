import { Options } from '../../options.ts'
import content from './content.ts'

export default function head (yaml: any, config: any = {}): any {
  // initialise options
  const options = (config instanceof Options) ? config : new Options(config)

  // initialise result
  const result: any = {}

  // populate the result with the properties of the YAML object
  for (const key of Object.keys(yaml)) {
    result[key] = prepareProperty(yaml[key], options)
  }

  // give empty texts property to files without texts
  // this ensures bottom-level texts don't inherit the texts of their parents
  result.texts = result.texts || []

  // return the result
  return result
}

function prepareProperty (value: any, options: Options): any {
  if (typeof value === 'object' && value) {
    for (const key of Object.keys(value)) {
      value[key] = prepareProperty(value[key], options)
    }
  }

  if (typeof value === 'string') {
    return (value.slice(0, 4) === 'http')
      ? value.trim()
      : content(value.trim(), options)
  }

  if (Array.isArray(value)) {
    return value.map(x => prepareProperty(x, options))
  }

  return value
}
