import { Options } from '../../types.ts'
import content from './content.ts'
import lemmatize from './lemmatize.ts'

export default function block (text: string, options: Options): any {
  const result: any = {
    name: 'p',
    id: null,
    content: ''
  }

  const tagCheck = text.match(/^\{(.*?)\}\s+/)
  if (tagCheck) {
    // remove the tag from the text
    text = text.replace(/^\{(.*?)\}\s+/, '')

    // parse the properties
    const properties = tagCheck[1].split(',').map(x => x.trim())
    properties.forEach((property) => {
      const titleCheck = property.match(/^title$/)
      const idCheck = property.match(/^#(.*?)$/)
      const nameValueCheck = property.match(/^(.*?)=(.*?)$/)
      if (titleCheck) {
        result.name = 'head'
      } else if (idCheck) {
        result.id = idCheck[1]
      } else if (nameValueCheck) {
        result[nameValueCheck[1]] = nameValueCheck[2]
      } else {
        throw new Error(`Malformed property "${property}".`)
      }
    })
  }

  try {
    result.content = content(text, options)
    if (options.lemmatize) {
      result.content = lemmatize(result.content, options.lemmas)
    }
  } catch (error) {
    error.blockId = result.id
    throw error
  }

  return result
}
