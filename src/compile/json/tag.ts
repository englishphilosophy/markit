import { Rules, Tag } from '../../types.ts'

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
export function insertion (text: string, rules: Rules): string {
  if (rules['{++text++}'] && rules['{++text++}'][0] !== undefined) {
    return rules['{++text++}'][0].replace(/{text}/g, text)
  }
  throw new Error('No rule found for \'{++text++}\' tag.')
}

// deletion
export function deletion (text: string, rules: Rules): string {
  if (rules['{--text--}'] && rules['{--text--}'][0] !== undefined) {
    return rules['{--text--}'][0].replace(/{text}/g, text)
  }
  throw new Error('No rule found for \'{--text--}\' tag.')
}

// replacement
export function replacement (text1: string, text2: string, rules: Rules): string {
  if (rules['{~~text1->text2~~}'] && rules['{~~text1->text2~~}'][0] !== undefined) {
    return rules['{~~text1->text2~~}'][0].replace(/{text1}/g, text1).replace(/{text2}/g, text2)
  }
  throw new Error('No rule found for \'{~~text1->text2~~}\' tag.')
}

// footnote
export function footnote (id: string, rules: Rules): string {
  if (rules['[nX]'] && rules['[nX]'][0] !== undefined) {
    return rules['[nX]'][0].replace(/{X}/g, id)
  }
  throw new Error('No rule found for \'[nX]\' tag.')
}

// link
export function link (text1: string, text2: string, rules: Rules): string {
  if (rules['[text1](text2)'] && rules['[text1](text2)'][0] !== undefined) {
    return rules['[text1](text2)'][0].replace(/{text1}/g, text1).replace(/{text2}/g, text2)
  }
  throw new Error('No rule found for \'[text1](text2)\' tag.')
}

// citation
export function citation (text: string, rules: Rules): string {
  if (rules['[text]'] && rules['[text]'][0] !== undefined) {
    return rules['[text]'][0].replace(/{text}/g, text)
  }
  throw new Error('No rule found for \'[text]\' tag.')
}
