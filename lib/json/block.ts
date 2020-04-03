import Options from '../options.ts'
import content from './content.ts'

export default class Block {
  name: string
  id: string|null
  content: string
  [others: string]: any

  constructor (text?: string, options?: Options) {
    this.name = 'p'
    this.id = null
    this.content = ''

    if (text && options) {
      this.readMarkit(text, options)
    }
  }

  readMarkit (text: string, options: Options) {
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
          this.name = 'head'
        } else if (idCheck) {
          this.id = idCheck[1]
        } else if (nameValueCheck) {
          this[nameValueCheck[1]] = nameValueCheck[2]
        } else {
          throw new Error(`Malformed property "${property}".`)
        }
      })
    }
  
    try {
      this.content = content(text, options)
    } catch (error) {
      error.blockId = this.id
      throw error
    }
  }
}
