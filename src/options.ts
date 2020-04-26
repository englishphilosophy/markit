import { Rules, html, tei, txt } from './rules.ts'

export class Options {
  format: 'html'|'json'|'tei'|'txt'
  extension: 'html'|'json'|'xml'|'txt'
  textFormat: 'path'|'stub'|'full'
  textStubProperties: string[]
  maximumDepth: number
  rules: Rules
  createLogFile: boolean

  constructor (config: any = {}) {
    // set defaults
    this.format = 'tei'
    this.extension = 'xml'
    this.textFormat = 'full'
    this.textStubProperties = []
    this.maximumDepth = -1
    this.rules = tei
    this.createLogFile = false

    // maybe overwrite defaults with custom config data
    if (config.format) {
      switch (config.format) {
        case 'html':
          this.format = config.format
          this.extension = 'html'
          this.rules = html
          break
    
        case 'json':
          this.format = config.format
          this.extension = 'json'
          break
    
        case 'tei':
          this.format = config.format
          this.extension = 'xml'
          this.rules = tei
          break
    
        case 'txt':
          this.format = config.format
          this.extension = 'txt'
          this.rules = txt
          break
      }
    }

    if (config.textFormat) {
      switch (config.textFormat) {
        case 'path': // fallthrough
        case 'stub':  // fallthrough
        case 'full':
          this.textFormat = config.textFormat
      }
    }

    if (config.textStubProperties && Array.isArray(config.textStubProperties)) {
      for (const property of config.textStubProperties) {
        if (typeof property === 'string') {
          this.textStubProperties.push(property)
        }
      }
    }

    if (config.maximumDepth) {
      if (typeof config.maximumDepth === 'number') {
        this.maximumDepth = config.maximumDepth
      }
    }

    if (config.rules) {
      this.rules['~~'] = config.rules['~~'] || this.rules['~~']
      this.rules['~'] = config.rules['~'] || this.rules['~']
      this.rules['//'] = config.rules['//'] || this.rules['//']
      this.rules['|'] = config.rules['|'] || this.rules['|']
      this.rules['£1'] = config.rules['£1'] || this.rules['£1']
      this.rules['£2'] = config.rules['£2'] || this.rules['£2']
      this.rules['£3'] = config.rules['£3'] || this.rules['£3']
      this.rules['£4'] = config.rules['£4'] || this.rules['£4']
      this.rules['£5'] = config.rules['£5'] || this.rules['£5']
      this.rules['£6'] = config.rules['£6'] || this.rules['£6']
      this.rules['""'] = config.rules['""'] || this.rules['""']
      this.rules['"'] = config.rules['"'] || this.rules['"']
      this.rules['*'] = config.rules['*'] || this.rules['*']
      this.rules['_'] = config.rules['_'] || this.rules['_']
      this.rules['^'] = config.rules['^'] || this.rules['^']
      this.rules['='] = config.rules['='] || this.rules['=']
      this.rules['$'] = config.rules['$'] || this.rules['$']
      this.rules['#'] = config.rules['#'] || this.rules['#']
      this.rules['{++text++}'] = config.rules['{++text++}'] || this.rules['{++text++}']
      this.rules['{--text--}'] = config.rules['{--text--}'] || this.rules['{--text--}']
      this.rules['{~~text1->text2~~}'] = config.rules['{~~text1->text2~~}'] || this.rules['{~~text1->text2~~}']
      this.rules['[nX]'] = config.rules['[nX]'] || this.rules['[nX]']
      this.rules['[text1](text2)'] = config.rules['[text1](text2)'] || this.rules['[text1](text2)']
      this.rules['[text]'] = config.rules['[text]'] || this.rules['[text]']
    }

    if (config.createLogFile) {
      this.createLogFile = config.createLogFile
    }
  }
}
