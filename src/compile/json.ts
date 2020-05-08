import {
  dirname,
  parseYaml
} from '../../deps.ts'
import { Options } from '../options.ts'
import file from './json/file.ts'
import head from './json/head.ts'
import block from './json/block.ts'

export default function json (inputFilePath: string, config: any = {}, depth: number = 0): any {
  // initialise options
  const options = (config instanceof Options) ? config : new Options(config)

  try {
    // read the file contents
    const fileContents = file(inputFilePath)

    // split into YAML top bit and rest of file
    const yamlRegExp = /^---\n((.|\n)*?)\n---\n?/
    const yamlCheck = fileContents.match(yamlRegExp)
    const yaml: any = yamlCheck ? parseYaml(yamlCheck[1]) : {}
    const body = yamlCheck ? fileContents.replace(yamlRegExp, '') : fileContents

    // get basic metadata from the yaml
    const result = head(yaml, options)

    // add inherited properties recursively
    const inherit = result.inherit || result.parent
    if ((depth <= 0) && inherit) {
      const inheritFilePath = `${dirname(inputFilePath)}/${inherit}`
      const inheritResult = json(inheritFilePath, options, depth - 1)
      for (const key of Object.keys(inheritResult)) {
        result[key] = result[key] || inheritResult[key]
      }
      delete result.inherit
      delete result.parent
    }

    // map texts
    if ((0 <= depth) && (options.maximumDepth < 0 || depth < options.maximumDepth)) {
      switch (options.textFormat) {
        case 'path':
          result.texts = result.texts
            .map((path: string) => path.replace(/\.mit$/, `.${options.format}`))
          break
    
        case 'full':
          result.texts = result.texts
            .map((path: string) => json(`${dirname(inputFilePath)}/${path}`, options, depth + 1))
          break
    
        case 'stub':
          result.texts = result.texts
            .map((path: string) => {
              const subResult = json(`${dirname(inputFilePath)}/${path}`, options, depth + 1)
              const stub: any = {}
              for (const property of options.textStubProperties) {
                stub[property] = subResult[property] || result[property]
              }
              if (options.maximumDepth < 0 || depth < options.maximumDepth - 1) {
                stub.texts = subResult.texts
              }
              return stub
            })
          break
      }
    }

    // get blocks from the body
    result.blocks = []
    if ((depth === 0) || (depth >= 0 && options.textFormat === 'full')) {
      if (body.length > 0) {
        for (const blockText of body.split('\n\n')) {
          result.blocks.push(block(blockText, options, result.id))
        }
      }
    }
    
    // return the object
    return result

  } catch (error) {
    // log the input file path to the console and pass the error up
    console.log(`Error trace: ${inputFilePath}`)
    throw error
  }
}
