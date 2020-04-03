import { Format, ContentFormat, Rules, defaultRules } from './rules.ts'

export default class Options {
  format: Format
  rules: Rules

  constructor () {
    this.format = 'tei'
    this.rules = defaultRules.tei
  }

  load (config: any) {
    if (config.format) {
      switch (config.format) {
        case 'html':
        case 'json':
        case 'tei':
        case 'txt':
          this.format = config.format
          break
      }
    }

    if (config.contentFormat) {
      switch (config.contentFormat) {
        case 'html':
        case 'mit':
        case 'tei':
        case 'txt':
          this.rules = defaultRules[config.contentFormat as ContentFormat]
          break
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
  }
}
