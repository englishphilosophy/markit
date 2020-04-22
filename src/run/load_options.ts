import { Options } from '../types.ts'
import defaults from '../options/defaults.ts'
import { html, mit, tei, txt } from '../options/rules.ts'

export default function loadOptions (config: any): Options {
  // initialise default options
  const options = defaults

  if (config.format) {
    switch (config.format) {
      case 'html':
        options.format = config.format
        options.extension = 'html'
        options.contentFormat = 'html'
        options.rules = html
        break

      case 'json':
        options.format = config.format
        options.extension = 'json'
        options.contentFormat = 'mit'
        options.rules = mit
        break

      case 'tei':
        options.format = config.format
        options.extension = 'xml'
        options.contentFormat = 'tei'
        options.rules = tei
        break

      case 'txt':
        options.format = config.format
        options.extension = 'txt'
        options.contentFormat = 'txt'
        options.rules = txt
        break
    }
  }

  if (config.textFormat) {
    switch (config.textFormat) {
      case 'path': // fallthrough
      case 'stub':  // fallthrough
      case 'full':
        options.textFormat = config.textFormat
    }
  }

  if (config.textStubProperties && Array.isArray(config.textStubProperties)) {
    config.textStubProperties.forEach((property: any) => {
      if (typeof property === 'string') {
        options.textStubProperties.push(property)
      }
    })
  }

  if (config.maximumDepth) {
    if (typeof config.maximumDepth === 'number') {
      options.maximumDepth = config.maximumDepth
    }
  }

  if (config.contentFormat) {
    switch (config.contentFormat) {
      case 'html':
        options.contentFormat = 'html'
        options.rules = html
        break

      case 'mit':
        options.contentFormat = 'mit'
        options.rules = mit
        break
    
      case 'tei':
        options.contentFormat = 'tei'
        options.rules = tei
        break

      case 'txt':
        options.contentFormat = 'txt'
        options.rules = txt
        break
    }
  }

  if (config.rules) {
    options.rules['~~'] = config.rules['~~'] || options.rules['~~']
    options.rules['~'] = config.rules['~'] || options.rules['~']
    options.rules['//'] = config.rules['//'] || options.rules['//']
    options.rules['|'] = config.rules['|'] || options.rules['|']
    options.rules['£1'] = config.rules['£1'] || options.rules['£1']
    options.rules['£2'] = config.rules['£2'] || options.rules['£2']
    options.rules['£3'] = config.rules['£3'] || options.rules['£3']
    options.rules['£4'] = config.rules['£4'] || options.rules['£4']
    options.rules['£5'] = config.rules['£5'] || options.rules['£5']
    options.rules['£6'] = config.rules['£6'] || options.rules['£6']
    options.rules['""'] = config.rules['""'] || options.rules['""']
    options.rules['"'] = config.rules['"'] || options.rules['"']
    options.rules['*'] = config.rules['*'] || options.rules['*']
    options.rules['_'] = config.rules['_'] || options.rules['_']
    options.rules['^'] = config.rules['^'] || options.rules['^']
    options.rules['='] = config.rules['='] || options.rules['=']
    options.rules['$'] = config.rules['$'] || options.rules['$']
    options.rules['#'] = config.rules['#'] || options.rules['#']
    options.rules['{++text++}'] = config.rules['{++text++}'] || options.rules['{++text++}']
    options.rules['{--text--}'] = config.rules['{--text--}'] || options.rules['{--text--}']
    options.rules['{~~text1->text2~~}'] = config.rules['{~~text1->text2~~}'] || options.rules['{~~text1->text2~~}']
    options.rules['[nX]'] = config.rules['[nX]'] || options.rules['[nX]']
    options.rules['[text1](text2)'] = config.rules['[text1](text2)'] || options.rules['[text1](text2)']
    options.rules['[text]'] = config.rules['[text]'] || options.rules['[text]']
  }

  if (config.createLogFile) {
    options.createLogFile = config.createLogFile
  }
  /*
  if (config.lexicon && (typeof config.lexicon === 'string')) {
    let lexicon: any
    try {
      lexicon = parseYaml(readFileStrSync('lexicon.yml'))
    } catch (error) {
      throw new Error(`Failed to open or parse lexicon file.`)
    }

    Object.keys(lexicon).forEach((lemma: any) => {
      if (!Array.isArray(lexicon[lemma])) {
        throw new Error(`Lexicon entry for '${lemma} is not an array.`)
      }
      lexicon[lemma].forEach((word: any) => {
        if (typeof word === 'string') {
          options.lemmas[word] = lemma
        } else {
          throw new Error(`Lexicon entry for '${lemma} does not contain only strings.`)
        }
      })
    })
  }*/

  return options
}
