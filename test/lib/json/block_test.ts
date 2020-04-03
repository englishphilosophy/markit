import { assertEquals, assertThrows } from '../../../deps_test.ts'
import Options from '../../../lib/options.ts'
import Block from '../../../lib/json/block.ts'
import content from '../../../lib/json/content.ts'

Deno.test({
  name: 'src/json/block.ts',
  fn() {
    const options = new Options()
    const block = new Block()
    const expected = new Block()

    block.readMarkit('Some text', options)
    expected.name = 'p'
    expected.id = null
    expected.content = content('Some text', options)
    assertEquals(block, expected)

    block.readMarkit('{#id} Some text', options)
    expected.name = 'p'
    expected.id = 'id'
    expected.content = content('Some text', options)
    assertEquals(block, expected)

    block.readMarkit('{#id,foo=bar,baz=banana} Some text', options)
    expected.name = 'p'
    expected.id = 'id'
    expected.content = content('Some text', options)
    expected.foo = 'bar'
    expected.baz = 'banana'
    assertEquals(block, expected)

    assertThrows(() => {
      block.readMarkit('{#id,foo=bar,bazbanana} Some text', options)
    }, Error, 'Malformed property "bazbanana".')
  }
})
