import Options from '../options.ts'
import { Tag, Rules } from '../rules.ts'

// generic opening tag
export function open (tag: Tag, rules: Rules): string {
  if (rules[tag] && rules[tag][0] !== undefined) {
    return rules[tag][0]
  }
  throw new Error(`No opening rule found for ${tag} tag.`)
}

// generic closing tag
export function close (tag: Tag, rules: Rules): string {
  if (rules[tag] && rules[tag][1] !== undefined) {
    return rules[tag][1]
  }
  throw new Error(`No closing rule found for ${tag} tag.`)
}

// insertion
export function insertion (text: string, options: Options): string {
  if (options.rules['{++text++}'] && options.rules['{++text++}'][0]) {
    return options.rules['{++text++}'][0].replace(/{text}/g, text)
  }
  throw new Error('No rule found for \'{++text++}\' tag.')
}

// deletion
export function deletion (text: string, options: Options): string {
  if (options.rules['{--text--}'] && options.rules['{--text--}'][0]) {
    return options.rules['{--text--}'][0].replace(/{text}/g, text)
  }
  throw new Error('No rule found for \'{--text--}\' tag.')
}

// replacement
export function replacement (text1: string, text2: string, options: Options): string {
  if (options.rules['{~~text1->text2~~}'] && options.rules['{~~text1->text2~~}'][0]) {
    return options.rules['{~~text1->text2~~}'][0].replace(/{text1}/g, text1).replace(/{text2}/g, text2)
  }
  throw new Error('No rule found for \'{~~text1->text2~~}\' tag.')
}

// footnote
export function footnote (id: string, options: Options): string {
  if (options.rules['[nX]'] && options.rules['[nX]'][0]) {
    return options.rules['[nX]'][0].replace(/{X}/g, id)
  }
  throw new Error('No rule found for \'[nX]\' tag.')
}

// link
export function link (text1: string, text2: string, options: Options): string {
  if (options.rules['[text1](text2)'] && options.rules['[text1](text2)'][0]) {
    return options.rules['[text1](text2)'][0].replace(/{text1}/g, text1).replace(/{text2}/g, text2)
  }
  throw new Error('No rule found for \'[text1](text2)\' tag.')
}

// citation
export function citation (text: string, options: Options): string {
  if (options.rules['[text]'] && options.rules['[text]'][0]) {
    return options.rules['[text]'][0].replace(/{text}/g, text)
  }
  throw new Error('No rule found for \'[text]\' tag.')
}
