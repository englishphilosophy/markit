import { assertEquals } from '../../deps_test.ts'
import markit from '../../lib/markit.ts'
import Options from '../../lib/options.ts'
import markitToJson from '../../lib/json.ts'
import jsonToTei from '../../lib/tei.ts'
import jsonToHtml from '../../lib/html.ts'
import jsonToTxt from '../../lib/txt.ts'

Deno.test({
  name: 'src/markit.ts',
  fn() {
    const options = new Options()

    options.format = 'json'
    const jsonResult = markit('test/files/file.mit', options)
    const expectedJsonResult = `${JSON.stringify(markitToJson('test/files/file.mit', options), null, 2)}\n`
    assertEquals(jsonResult, expectedJsonResult)

    options.format = 'tei'
    const teiResult = markit('test/files/file.mit', options)
    const expectedTeiResult = jsonToTei(markitToJson('test/files/file.mit', options), options)
    assertEquals(teiResult, expectedTeiResult)

    options.format = 'html'
    const htmlResult = markit('test/files/file.mit', options)
    const expectedHtmlResult = jsonToHtml(markitToJson('test/files/file.mit', options), options)
    assertEquals(htmlResult, expectedHtmlResult)

    options.format = 'txt'
    const txtResult = markit('test/files/file.mit', options)
    const expectedTxtResult = jsonToTxt(markitToJson('test/files/file.mit', options), options)
    assertEquals(txtResult, expectedTxtResult)
  }
})
