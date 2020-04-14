import { assertEquals } from '../deps_test.ts'
import compile from '../src/compile.ts'
import options from '../src/options/defaults.ts'
import markitToJson from '../src/compile/json.ts'
import jsonToTei from '../src/compile/tei.ts'
import jsonToHtml from '../src/compile/html.ts'
import jsonToTxt from '../src/compile/txt.ts'

Deno.test({
  name: 'src/compile.ts',
  fn() {
    options.format = 'json'
    const jsonResult = compile('test_files/file.mit', options)
    const expectedJsonResult = `${JSON.stringify(markitToJson('test_files/file.mit', options), null, 2)}\n`
    assertEquals(jsonResult, expectedJsonResult)

    options.format = 'tei'
    const teiResult = compile('test_files/file.mit', options)
    const expectedTeiResult = jsonToTei(markitToJson('test_files/file.mit', options), options)
    assertEquals(teiResult, expectedTeiResult)

    options.format = 'html'
    const htmlResult = compile('test_files/file.mit', options)
    const expectedHtmlResult = jsonToHtml(markitToJson('test_files/file.mit', options), options)
    assertEquals(htmlResult, expectedHtmlResult)

    options.format = 'txt'
    const txtResult = compile('test_files/file.mit', options)
    const expectedTxtResult = jsonToTxt(markitToJson('test_files/file.mit', options), options)
    assertEquals(txtResult, expectedTxtResult)
  }
})
