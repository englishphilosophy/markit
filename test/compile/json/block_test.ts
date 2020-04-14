import { assertEquals, assertThrows } from '../../../deps_test.ts'
import options from '../../../src/options/defaults.ts'
import block from '../../../src/compile/json/block.ts'
import content from '../../../src/compile/json/content.ts'

Deno.test({
  name: 'src/compile/json/block.ts',
  fn() {
    const block1 = block('Some text', options)
    const expected1 = {
      name: 'p',
      id: null,
      content: content('Some text', options)
    }
    assertEquals(block1, expected1)

    const block2 = block('{#id} Some text', options)
    const expected2 = {
      name: 'p',
      id: 'id',
      content: content('Some text', options)
    }
    assertEquals(block2, expected2)

    const block3 = block('{#id,foo=bar,baz=banana} Some text', options)
    const expected3 = {
      name: 'p',
      id: 'id',
      content: content('Some text', options),
      foo: 'bar',
      baz: 'banana'
    }
    assertEquals(block3, expected3)

    assertThrows(() => {
      block('{#id,foo=bar,bazbanana} Some text', options)
    }, Error, 'Malformed property "bazbanana".')
  }
})
