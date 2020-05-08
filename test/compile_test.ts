import { assertEquals } from '../deps_test.ts'
import compile from '../src/compile.ts'
import markitToJson from '../src/compile/json.ts'
import jsonToTei from '../src/compile/tei.ts'
import jsonToHtml from '../src/compile/html.ts'
import jsonToTxt from '../src/compile/txt.ts'

Deno.test({
  name: 'src/compile.ts',
  fn() {
    const jsonResult = compile('test_files/file.mit', { format: 'json' })
    const json = markitToJson('test_files/file.mit', { format: 'json' })
    const expectedJsonResult = `${JSON.stringify(json)}\n`
    assertEquals(jsonResult, expectedJsonResult)

    const teiResult = compile('test_files/file.mit', { format: 'tei' })
    const jsonTei = markitToJson('test_files/file.mit', { format: 'tei' })
    const expectedTeiResult = jsonToTei(jsonTei, { format: 'tei' })
    assertEquals(teiResult, expectedTeiResult)

    const htmlResult = compile('test_files/file.mit', { format: 'html' })
    const jsonHtml = markitToJson('test_files/file.mit', { format: 'html' })
    const expectedHtmlResult = jsonToHtml(jsonHtml, { format: 'html' })
    assertEquals(htmlResult, expectedHtmlResult)

    const txtResult = compile('test_files/file.mit', { format: 'txt' })
    const jsonTxt = markitToJson('test_files/file.mit', { format: 'txt' })
    const expectedTxtResult = jsonToTxt(jsonTxt, { format: 'txt' })
    assertEquals(txtResult, expectedTxtResult)
  }
})
