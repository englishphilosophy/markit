import { assertEquals } from '../../deps_test.ts'
import json from '../../src/compile/json.ts'
import options from '../../src/options/defaults.ts'
import block from '../../src/compile/json/block.ts'

Deno.test({
  name: 'src/compile/json.ts',
  fn() {
    options.format = 'json'
    const result = json('test_files/file.mit', options)
    const expectedResult = {
      id: 'Test',
      foo: 'bar',
      texts: [],
      blocks: [block('{#1} This is a paragraph.', options)]
    }
    assertEquals(result, expectedResult)
  }
})
