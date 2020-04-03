import { dirname, parseYaml } from '../deps.ts'
import Options from './options.ts'
import readMarkitFile from './json/read.ts'
import Block from './json/block.ts'

export default function json (inputFilePath: string, options: Options): any {
  try {
    // read the file contents
    const fileContents = readMarkitFile(inputFilePath)

    // replace windows line breaks with unix line breaks
    const normalizedText = fileContents.replace(/\r\n/g, '\n')

    // check for YAML at the start of the document
    const yamlCheck = normalizedText.match(/^---\n((.|\n)*?)\n---\n/)

    // initialise the object (with the contents of the YAML part, if any)
    let result: any = yamlCheck ? parseYaml(yamlCheck[1]) : {}

    // give empty contents property to files without contents
    // this ensures bottom-level texts don't inherit the contents of their parents
    result.contents = result.contents || []

    // add inherited properties recursively
    const inherit = result.inherit || result.parent
    if (inherit) {
      const inheritFilePath = `${dirname(inputFilePath)}/${inherit}`
      const inheritJson = json(inheritFilePath, options)
      result = Object.assign(inheritJson, result)
    }

    // get the main content of the document (i.e. the non-YAML part)
    const content = yamlCheck
      ? normalizedText.replace(/^---\n((.|\n)*?)\n---\n/, '')
      : normalizedText

    // create blocks from the content (using the block module) and add them to the object
    result.blocks = content.split('\n\n').map(x => new Block(x, options))

    // return the object
    return result

  } catch (error) {
    // add the input file path to the error object
    error.inputFilePath = inputFilePath
    throw error
  }
}
