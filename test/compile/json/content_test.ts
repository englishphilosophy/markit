import { assertEquals, assertThrows } from '../../../deps_test.ts'
import options from '../../../src/options/defaults.ts'
import content from '../../../src/compile/json/content.ts'

/*
Deno.test({
  name: 'src/compile/json/content.ts headings',
  fn() {
    // define content to test
    const text1 = '£1 heading 1 £1 text'
    const text2 = '£2 heading 2 £2 text'
    const text3 = '£3 heading 3 £3 text'
    const text4 = '£4 heading 4 £4 text'
    const text5 = '£5 heading 5 £5 text'
    const text6 = '£6 heading 6 £6 text'

    // test HTML output
    options.load({ contentFormat: 'html' })
    assertEquals(content(text1, options), '<h1>heading 1</h1> text')
    assertEquals(content(text2, options), '<h2>heading 2</h2> text')
    assertEquals(content(text3, options), '<h3>heading 3</h3> text')
    assertEquals(content(text4, options), '<h4>heading 4</h4> text')
    assertEquals(content(text5, options), '<h5>heading 5</h5> text')
    assertEquals(content(text6, options), '<h6>heading 6</h6> text')

    // test MIT output
    options.load({ contentFormat: 'mit' })
    assertEquals(content(text1, options), '£1 heading 1 £1 text')
    assertEquals(content(text2, options), '£2 heading 2 £2 text')
    assertEquals(content(text3, options), '£3 heading 3 £3 text')
    assertEquals(content(text4, options), '£4 heading 4 £4 text')
    assertEquals(content(text5, options), '£5 heading 5 £5 text')
    assertEquals(content(text6, options), '£6 heading 6 £6 text')

    // test TEI XML output
    options.load({ contentFormat: 'tei' })
    assertEquals(content(text1, options), '<title rend="h1">heading 1</title> text')
    assertEquals(content(text2, options), '<title rend="h2">heading 2</title> text')
    assertEquals(content(text3, options), '<title rend="h3">heading 3</title> text')
    assertEquals(content(text4, options), '<title rend="h4">heading 4</title> text')
    assertEquals(content(text5, options), '<title rend="h5">heading 5</title> text')
    assertEquals(content(text6, options), '<title rend="h6">heading 6</title> text')

    // test TXT output
    options.load({ contentFormat: 'txt' })
    assertEquals(content(text1, options), 'heading 1\ntext')
    assertEquals(content(text2, options), 'heading 2\ntext')
    assertEquals(content(text3, options), 'heading 3\ntext')
    assertEquals(content(text4, options), 'heading 4\ntext')
    assertEquals(content(text5, options), 'heading 5\ntext')
    assertEquals(content(text6, options), 'heading 6\ntext')

    // error tests
    const badText1 = '£1 heading'
    const badText2 = '£whoops'
    const badText3 = '£1 heading £2'
    const badText4 = '£7 heading £7'

    assertThrows(() => { content(badText1, options) }, Error, 'Malformed heading block.')
    assertThrows(() => { content(badText2, options) }, Error, 'Malformed heading block.')
    assertThrows(() => { content(badText3, options) }, Error, 'Mismatched heading tags.')
    assertThrows(() => { content(badText4, options) }, Error, 'Heading tags must use a number between 1 and 6.')
  }
})

Deno.test({
  name: 'src/compile/json/content.ts spans',
  fn() {
    // define content to test
    const text1 = '*bold text*'
    const text2 = '_italic text_'
    const text3 = '^small-caps text^'
    const text4 = '=name='
    const text5 = '$foreign text$'
    const text6 = '$$greek text$$'
    const text7 = '#margin comment#'

    // test HTML output
    options.load({ contentFormat: 'html' })
    assertEquals(content(text1, options), '<strong>bold text</strong>')
    assertEquals(content(text2, options), '<em>italic text</em>')
    assertEquals(content(text3, options), '<span class="small-capitals">small-caps text</span>')
    assertEquals(content(text4, options), '<span class="name">name</span>')
    assertEquals(content(text5, options), '<span class="foreign">foreign text</span>')
    assertEquals(content(text6, options), '<span class="foreign">γρεεκ τεξτ</span>')
    assertEquals(content(text7, options), '<span class="margin-comment">margin comment</span>')

    // test MIT output
    options.load({ contentFormat: 'mit' })
    assertEquals(content(text1, options), '*bold text*')
    assertEquals(content(text2, options), '_italic text_')
    assertEquals(content(text3, options), '^small-caps text^')
    assertEquals(content(text4, options), '=name=')
    assertEquals(content(text5, options), '$foreign text$')
    assertEquals(content(text6, options), '$γρεεκ τεξτ$')
    assertEquals(content(text7, options), '#margin comment#')

    // test TEI XML output
    options.load({ contentFormat: 'tei' })
    assertEquals(content(text1, options), '<hi rend="bold">bold text</hi>')
    assertEquals(content(text2, options), '<hi rend="italic">italic text</hi>')
    assertEquals(content(text3, options), '<hi rend="small-capitals">small-caps text</hi>')
    assertEquals(content(text4, options), '<name>name</name>')
    assertEquals(content(text5, options), '<foreign>foreign text</foreign>')
    assertEquals(content(text6, options), '<foreign>γρεεκ τεξτ</foreign>')
    assertEquals(content(text7, options), '<note type="margin">margin comment</note>')

    // test TXT output
    options.load({ contentFormat: 'txt' })
    assertEquals(content(text1, options), 'bold text')
    assertEquals(content(text2, options), 'italic text')
    assertEquals(content(text3, options), 'small-caps text')
    assertEquals(content(text4, options), 'name')
    assertEquals(content(text5, options), 'foreign text')
    assertEquals(content(text6, options), 'γρεεκ τεξτ')
    assertEquals(content(text7, options), '#margin comment#')

    // error tests
    const badText1 = '*whoops_*'
    const badText2 = '*whoops_'
    const badText3 = '_whoops'
    const badText4 = '=oh dear'
    const badText5 = '$$greek text$'

    assertThrows(() => { content(badText1, options) }, Error, 'Unterminated * tag.')
    assertThrows(() => { content(badText2, options) }, Error, 'Unterminated _ tag.')
    assertThrows(() => { content(badText3, options) }, Error, 'Unterminated _ tag.')
    assertThrows(() => { content(badText4, options) }, Error, 'Unterminated = tag.')
    assertThrows(() => { content(badText5, options) }, Error, 'Unterminated $$ tag.')
  }
})
*/
