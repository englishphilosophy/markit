import { assertEquals } from '../../deps_test.ts'
import json from '../../src/compile/json.ts'
import block from '../../src/compile/json/block.ts'

Deno.test({
  name: 'src/compile/json.ts',
  fn() {
    const result = json('test_files/file.mit', { format: 'json '})
    const expectedResult = {
      id: 'Test',
      foo: 'bar',
      texts: [],
      blocks: [
        block('{title} This is the title.', {}, 'Test'),
        block('{#1} This is a paragraph.', {}, 'Test'),
        block('{#n1} This is a footnote.', {}, 'Test')
      ]
    }
    assertEquals(result, expectedResult)
  }
})
