import { Options, Tag } from '../../types.ts'
import greek from './greek.ts'
import * as tag from './tag.ts'

export default function content (text: string, options: Options): string {
  // convert to a single line
  text = text.split('\n').map(x => x.trim()).filter(x => x.length > 0).join(' ')
  
  const formattingStack = []
  let currentFormat
  let inBlockQuotation = false
  let inInlineQuotation = false
  let inXML = false
  let inGreek = false
  let rest
  let headingCheck
  let deletionCheck
  let insertionCheck
  let replacementCheck
  let footnoteCheck
  let linkCheck
  let citationCheck

  let result = ''
  let i = 0

  // loop through each character
  while (i < text.length) {
    // don't change anything inside XML tags
    if (inXML) {
      result += text[i]
      i += 1
      continue
    }

    // otherwise handle Markit stuff
    switch (text[i]) {
      // escaped an special characters
      case '\\':
        if (text[i + 1] === 'S') {
          result += '§'
        } else if (text[i + 1]) {
          result += text[i + 1]
        } else {
          throw new Error('Text cannot end with a backslash \\.')
        }
        i += 2
        break

      // XML tags
      case '<': // fallthrough
      case '>':
        inXML = (text[i] === '<')
        result += text[i]
        i += 1
        break

      // ampersands
      case '&':
        if ((options.format === 'html' || options.format === 'tei') && !(text.slice(i) && text.slice(i).match(/^&[a-z]+;/))) {
          result += '&amp;'
        } else {
          result += text[i]
        }
        i += 1
        break

      // spaces
      case '~':
        if (text[i + 1] === '~') {
          result += tag.open('~~', options.rules)
          i += 2
        } else {
          result += tag.open('~', options.rules)
          i += 1
        }
        break

      // line breaks
      case '/':
        if (text[i + 1] === '/') {
          result += tag.open('//', options.rules)
          i += 2
        } else {
          result += text[i]
          i += 1
        }
        break

      // page breaks
      case '|':
        result += tag.open('|', options.rules)
        i += 1
        break

      // headings
      case '£':
        headingCheck = text.slice(i).match(/^£(\d) (.*?) £(\d)\s?/)
        if (!headingCheck) {
          throw new Error('Malformed heading block.')
        }
        if (headingCheck[1] !== headingCheck[3]) {
          throw new Error('Mismatched heading tags.')
        }
        if (parseInt(headingCheck[1]) < 1 || parseInt(headingCheck[1]) > 6) {
          throw new Error('Heading tags must use a number between 1 and 6.')
        }
        result += tag.open(`£${headingCheck[1]}` as Tag, options.rules)
        result += content(headingCheck[2], options)
        result += tag.close(`£${headingCheck[1]}` as Tag, options.rules)
        i += headingCheck[0].length
        break

      // quotations
      case '"':
        if (text[i + 1] === '"') {
          if (inBlockQuotation) {
            result += tag.close('""', options.rules)
            inBlockQuotation = false
          } else {
            result += tag.open('""', options.rules)
            inBlockQuotation = true
          }
          i += 2
        } else {
          if (inInlineQuotation) {
            result += tag.close('"', options.rules)
            inInlineQuotation = false
          } else {
            result += tag.open('"', options.rules)
            inInlineQuotation = true
          }
          i += 1
        }
        break

      // ligatures and edits
      case '{':
        rest = text.slice(i)
        deletionCheck = rest.match(/^\{--(.*?)--\}/)
        insertionCheck = rest.match(/^\{\+\+(.*?)\+\+\}/)
        replacementCheck = rest.match(/^\{~~(.*?)->(.*?)~~}/)
        if (deletionCheck) {
          result += tag.deletion(content(deletionCheck[1], options), options.rules)
          i += deletionCheck[0].length
        } else if (insertionCheck) {
          result += tag.insertion(content(insertionCheck[1], options), options.rules)
          i += insertionCheck[0].length
        } else if (replacementCheck) {
          result += tag.replacement(content(replacementCheck[1], options), content(replacementCheck[2], options), options.rules)
          i += replacementCheck[0].length
        } else {
          // ligature
          if (rest.match(/^\{AE\}/)) {
            result += 'Æ'
          } else if (rest.match(/\{ae\}/)) {
            result += 'æ'
          } else if (rest.match(/\{OE\}/)) {
            result += 'Œ'
          } else if (rest.match(/\{oe\}/)) {
            result += 'œ'
          } else {
            throw new Error('Unrecognised ligature.')
          }
          i += 4
        }
        break

      // footnotes, links, citations
      case '[':
        footnoteCheck = text.slice(i).match(/^\[n([0-9*]+)\]/)
        linkCheck = text.slice(i).match(/^\[(.*?)\]\((.*?)\)/)
        citationCheck = text.slice(i).match(/^\[(.*?)\]/)
        if (footnoteCheck) {
          // TODO: add footnote ID to an array, for checking
          result += tag.footnote(footnoteCheck[1], options.rules)
          i += footnoteCheck[0].length
        } else if (linkCheck) {
          result += tag.link(content(linkCheck[1], options), linkCheck[2], options.rules)
          i += linkCheck[0].length
        } else if (citationCheck) {
          result += tag.citation(content(citationCheck[1], options), options.rules)
          i += citationCheck[0].length
        } else {
          throw new Error('Unterminated citation.')
        }
        break

      // simple spans
      case '*': // fallthrough
      case '_': // fallthrough
      case '^': // fallthrough
      case '=': // fallthrough
      case '$': // fallthrough
      case '#':
        if (text[i] === '$' && text[i + 1] === '$') {
          inGreek = !inGreek
          i += 1
        }
        currentFormat = formattingStack[formattingStack.length - 1]
        if (currentFormat === text[i]) {
          result += tag.close(text[i] as Tag, options.rules)
          formattingStack.pop()
        } else {
          result += tag.open(text[i] as Tag, options.rules)
          formattingStack.push(text[i])
        }
        i += 1
        break

      // default
      default:
        if (inGreek) {
          result += greek(text[i])
        } else {
          result += text[i]
        }
        i += 1
        break
    }
  }

  // final error checking
  if (formattingStack.length > 0) {
    throw new Error(`Unterminated ${formattingStack.pop()} tag.`)
  }

  if (inInlineQuotation) {
    throw new Error('Unterminated inline quotation.')
  }

  if (inBlockQuotation) {
    throw new Error('Unterminated block quotation.')
  }

  if (inXML) {
    throw new Error('Unterminated XML tag.')
  }

  if (inGreek) {
    throw new Error('Unterminated $$ tag.')
  }

  // return the result (trimmed)
  return result.trim()
}
