import { assertEquals, assertThrows } from '../../../deps_test.ts'
import content from '../../../src/compile/json/content.ts'

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
    assertEquals(content(text1, { format: 'html' }), '<h1>heading 1</h1> text')
    assertEquals(content(text2, { format: 'html' }), '<h2>heading 2</h2> text')
    assertEquals(content(text3, { format: 'html' }), '<h3>heading 3</h3> text')
    assertEquals(content(text4, { format: 'html' }), '<h4>heading 4</h4> text')
    assertEquals(content(text5, { format: 'html' }), '<h5>heading 5</h5> text')
    assertEquals(content(text6, { format: 'html' }), '<h6>heading 6</h6> text')

    // test TEI XML output
    assertEquals(content(text1, { format: 'tei' }), '<title rend="h1">heading 1</title> text')
    assertEquals(content(text2, { format: 'tei' }), '<title rend="h2">heading 2</title> text')
    assertEquals(content(text3, { format: 'tei' }), '<title rend="h3">heading 3</title> text')
    assertEquals(content(text4, { format: 'tei' }), '<title rend="h4">heading 4</title> text')
    assertEquals(content(text5, { format: 'tei' }), '<title rend="h5">heading 5</title> text')
    assertEquals(content(text6, { format: 'tei' }), '<title rend="h6">heading 6</title> text')

    // test TXT output
    assertEquals(content(text1, { format: 'txt' }), 'heading 1\ntext')
    assertEquals(content(text2, { format: 'txt' }), 'heading 2\ntext')
    assertEquals(content(text3, { format: 'txt' }), 'heading 3\ntext')
    assertEquals(content(text4, { format: 'txt' }), 'heading 4\ntext')
    assertEquals(content(text5, { format: 'txt' }), 'heading 5\ntext')
    assertEquals(content(text6, { format: 'txt' }), 'heading 6\ntext')

    // error tests
    const badText1 = '£1 heading'
    const badText2 = '£whoops'
    const badText3 = '£1 heading £2'
    const badText4 = '£7 heading £7'

    assertThrows(() => { content(badText1) }, Error, 'Malformed heading block.')
    assertThrows(() => { content(badText2) }, Error, 'Malformed heading block.')
    assertThrows(() => { content(badText3) }, Error, 'Mismatched heading tags.')
    assertThrows(() => { content(badText4) }, Error, 'Heading tags must use a number between 1 and 6.')
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
    assertEquals(content(text1, { format: 'html' }), '<strong>bold text</strong>')
    assertEquals(content(text2, { format: 'html' }), '<em>italic text</em>')
    assertEquals(content(text3, { format: 'html' }), '<span class="small-capitals">small-caps text</span>')
    assertEquals(content(text4, { format: 'html' }), '<span class="name">name</span>')
    assertEquals(content(text5, { format: 'html' }), '<span class="foreign">foreign text</span>')
    assertEquals(content(text6, { format: 'html' }), '<span class="foreign">γρεεκ τεξτ</span>')
    assertEquals(content(text7, { format: 'html' }), '<span class="margin-comment">margin comment</span>')

    // test TEI XML output
    assertEquals(content(text1, { format: 'tei' }), '<hi rend="bold">bold text</hi>')
    assertEquals(content(text2, { format: 'tei' }), '<hi rend="italic">italic text</hi>')
    assertEquals(content(text3, { format: 'tei' }), '<hi rend="small-capitals">small-caps text</hi>')
    assertEquals(content(text4, { format: 'tei' }), '<name>name</name>')
    assertEquals(content(text5, { format: 'tei' }), '<foreign>foreign text</foreign>')
    assertEquals(content(text6, { format: 'tei' }), '<foreign>γρεεκ τεξτ</foreign>')
    assertEquals(content(text7, { format: 'tei' }), '<note type="margin">margin comment</note>')

    // test TXT output
    assertEquals(content(text1, { format: 'txt' }), 'bold text')
    assertEquals(content(text2, { format: 'txt' }), 'italic text')
    assertEquals(content(text3, { format: 'txt' }), 'small-caps text')
    assertEquals(content(text4, { format: 'txt' }), 'name')
    assertEquals(content(text5, { format: 'txt' }), 'foreign text')
    assertEquals(content(text6, { format: 'txt' }), 'γρεεκ τεξτ')
    assertEquals(content(text7, { format: 'txt' }), '{margin comment}')

    // error tests
    const badText1 = '*whoops_*'
    const badText2 = '*whoops_'
    const badText3 = '_whoops'
    const badText4 = '=oh dear'
    const badText5 = '$$greek text$'

    assertThrows(() => { content(badText1) }, Error, 'Unterminated * tag.')
    assertThrows(() => { content(badText2) }, Error, 'Unterminated _ tag.')
    assertThrows(() => { content(badText3) }, Error, 'Unterminated _ tag.')
    assertThrows(() => { content(badText4) }, Error, 'Unterminated = tag.')
    assertThrows(() => { content(badText5) }, Error, 'Unterminated $$ tag.')
  }
})
