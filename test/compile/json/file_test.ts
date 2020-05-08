import {
  assertEquals
} from '../../../deps_test.ts'

import file from '../../../src/compile/json/file.ts'

Deno.test({
  name: 'src/compile/json/file.ts',
  fn() {
    const result = file('test_files/file.mit')
    const expectedResult = '---\nid: Test\nfoo: bar\n---\n{title}\nThis is the title.\n\n{#1} This is a paragraph.\n\n{#n1} This is a footnote.\n'
    assertEquals(result, expectedResult)
  }
})
