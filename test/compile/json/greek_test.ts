import { assertEquals, assertThrows } from '../../../deps_test.ts'
import greek from '../../../src/compile/json/greek.ts'

Deno.test({
  name: 'src/compile/json/greek.ts',
  fn() {
    const romanLC = 'abgdezhjiklmnxoprqstufcyw'.split('')
    const greekLC = 'αβγδεζηθικλμνξοπρςστυφχψω'.split('')
    
    const romanUC = romanLC.map(x => x.toUpperCase())
    const greekUC = greekLC.map(x => x.toUpperCase())

    romanLC.forEach((c, index) => {
      assertEquals(greek(c), greekLC[index])
    })

    romanUC.forEach((c, index) => {
      assertEquals(greek(c), greekUC[index])
    })
  }
})
