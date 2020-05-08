import { Options } from '../../options.ts'
import content from './content.ts'

export default function block (text: string, config: any = {}, parentId?: string): any {
  const options = (config instanceof Options) ? config : new Options(config)

  const result: any = {
    type: 'paragraph',
    content: text.trim()
  }

  const tagCheck = text.match(/^{(.*?)}\s+/)
  if (tagCheck) {
    // set the content as everything apart from the tag
    result.content = result.content.replace(/^{(.*?)}\s+/, '')

    // parse the properties
    const properties = tagCheck[1].split(',').map(x => x.trim())

    for (const property of properties) {
      const titleCheck = property.match(/^title$/)
      const idCheck = property.match(/^#(.*?)$/)
      const nameValueCheck = property.match(/^(.*?)=(.*?)$/)
      if (titleCheck) {
        result.type = 'title'
      } else if (idCheck) {
        result.subId = idCheck[1]
        if (result.subId[0] === 'n') {
          result.type = 'note'
        }
        result.id = parentId ? `${parentId}.${idCheck[1]}` : idCheck[1]
      } else if (nameValueCheck) {
        result[nameValueCheck[1]] = nameValueCheck[2]
      } else {
        throw new Error(`Malformed property "${property}".`)
      }
    }
  }

  // format the content
  try {
    result.content = content(result.content, options)
  } catch (error) {
    console.log(result.id)
    throw error
  }

  return result
}
