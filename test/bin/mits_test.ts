import { assertEquals } from '../../deps_test.ts'
import mits from '../../bin/mits.ts'

Deno.test({
  name: 'bin/mits.ts',
  fn() {
    const result = mits('test/files')
    const expectedResult = ['test/files/file.mit']
    assertEquals(result, expectedResult)
  }
})
