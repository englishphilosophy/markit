import { assertEquals } from '../../deps_test.ts'
import loadMitPaths from '../../src/run/load_mit_paths.ts'

Deno.test({
  name: 'src/run/load_mit_paths.ts',
  fn() {
    const result = loadMitPaths('test_files')
    const expectedResult = ['test_files/file.mit']
    assertEquals(result, expectedResult)
  }
})
