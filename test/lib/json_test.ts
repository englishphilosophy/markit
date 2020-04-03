import { assertEquals } from '../../deps_test.ts'
import json from '../../lib/json.ts'
import Options from '../../lib/options.ts'
import Block from '../../lib/json/block.ts'

Deno.test({
  name: 'src/json.ts',
  fn() {
    const options = new Options()
    options.format = 'json'
    const result = json('test/files/file.mit', options)
    const expectedResult = {
      id: 'Test',
      foo: 'bar',
      contents: [],
      blocks: [new Block('{#1} This is a paragraph.', options)]
    }
    assertEquals(result, expectedResult)
  }
})
