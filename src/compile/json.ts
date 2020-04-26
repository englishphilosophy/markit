import {
  dirname,
  parseYaml
} from '../../deps.ts'
import { Options } from '../options.ts'
import readMarkitFile from './json/read.ts'
import block from './json/block.ts'

export default function json (inputFilePath: string, config: any = {}, depth: number = 0): any {
  // initialise options
  const options = (config instanceof Options) ? config : new Options(config)

  try {
    // read the file contents
    const fileContents = readMarkitFile(inputFilePath)

    // replace windows line breaks with unix line breaks
    const normalizedText = fileContents.replace(/\r\n/g, '\n')

    // check for YAML at the start of the document
    const yamlCheck = normalizedText.match(/^---\n((.|\n)*?)\n---\n/)

    // initialise the object (with the contents of the YAML part, if any)
    let result: any = yamlCheck ? parseYaml(yamlCheck[1]) : {}
    for (const key of Object.keys(result)) {
      if (typeof result[key] === 'string') {
        result[key] = result[key].trim()
      }
    }

    // give empty texts property to files without texts
    // this ensures bottom-level texts don't inherit the texts of their parents
    result.texts = result.texts || []

    // add inherited properties recursively
    const inherit = result.inherit || result.parent
    if ((depth <= 0) && inherit) {
      const inheritFilePath = `${dirname(inputFilePath)}/${inherit}`
      const inheritJson = json(inheritFilePath, options, depth - 1)
      result = Object.assign(inheritJson, result)
      delete result.inherit
      delete result.parent
    }

    // get the main content of the document (i.e. the non-YAML part)
    const content = yamlCheck
      ? normalizedText.replace(/^---\n((.|\n)*?)\n---\n/, '')
      : normalizedText

    // map texts
    if ((0 <= depth) && (options.maximumDepth < 0 || depth < options.maximumDepth)) {
      result.texts = result.texts.map((path: string) => {
        if (options.textFormat === 'path') {
          return path.replace(/\.mit$/, `.${options.format}`)
        }
    
        const text = json(`${dirname(inputFilePath)}/${path}`, options, depth + 1)
    
        if (options.textFormat === 'full') {
          return text
        }

        const stub: any = {}
        for (const property of options.textStubProperties) {
          stub[property] = text[property] || result[property]
        }
        if (options.maximumDepth < 0 || depth < options.maximumDepth - 1) {
          stub.texts = text.texts
        }
        return stub
      })
    }

    // create blocks from the content (using the block module) and add them to the object
    result.blocks = []
    if ((depth === 0) || (depth >= 0 && options.textFormat === 'full')) {
      if (content.length > 0) {
        result.blocks = content.split('\n\n').map(x => block(x, result.id))
      }
    }

    // return the object
    return result

  } catch (error) {
    // add the input file path to the error object
    error.inputFilePath = inputFilePath
    throw error
  }
}
