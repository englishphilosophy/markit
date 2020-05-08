import { assertEquals, assertThrows } from '../../../deps_test.ts'
import greek from '../../../src/compile/json/greek.ts'

Deno.test({
  name: 'src/compile/json/greek.ts',
  fn() {
    const romanLC = 'abgdezhjiklmnxoprqstufcyw'.split('')
    const greekLC = 'αβγδεζηθικλμνξοπρςστυφχψω'.split('')
    
    const romanUC = romanLC.map(x => x.toUpperCase())
    const greekUC = greekLC.map(x => x.toUpperCase())

    for (let index in romanLC) {
      assertEquals(greek(romanLC[index]), greekLC[index])
    }

    for (let index in romanUC) {
      assertEquals(greek(romanUC[index]), greekUC[index])
    }
  }
})
