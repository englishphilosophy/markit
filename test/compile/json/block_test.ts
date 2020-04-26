import { assertEquals, assertThrows } from '../../../deps_test.ts'
import block from '../../../src/compile/json/block.ts'
import content from '../../../src/compile/content.ts'

Deno.test({
  name: 'src/compile/json/block.ts',
  fn() {
    const block1 = block('Some text')
    const expected1 = {
      name: 'p',
      id: null,
      content: content('Some text')
    }
    assertEquals(block1, expected1)

    const block2 = block('{#id} Some text')
    const expected2 = {
      name: 'p',
      id: 'id',
      content: content('Some text')
    }
    assertEquals(block2, expected2)

    const block3 = block('{#id,foo=bar,baz=banana} Some text')
    const expected3 = {
      name: 'p',
      id: 'id',
      content: content('Some text'),
      foo: 'bar',
      baz: 'banana'
    }
    assertEquals(block3, expected3)

    assertThrows(() => {
      block('{#id,foo=bar,bazbanana} Some text')
    }, Error, 'Malformed property "bazbanana".')
  }
})
