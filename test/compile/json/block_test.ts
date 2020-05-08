import { assertEquals, assertThrows } from '../../../deps_test.ts'
import block from '../../../src/compile/json/block.ts'
import content from '../../../src/compile/json/content.ts'

Deno.test({
  name: 'src/compile/json/block.ts',
  fn() {
    const block1 = block('Some text')
    const expected1 = {
      type: 'paragraph',
      content: content('Some text')
    }
    assertEquals(block1, expected1)

    const block2 = block('{#id} Some text')
    const expected2 = {
      type: 'paragraph',
      id: 'id',
      subId: 'id',
      content: content('Some text')
    }
    assertEquals(block2, expected2)

    const block3 = block('{#id,foo=bar,baz=banana} Some text')
    const expected3 = {
      type: 'paragraph',
      id: 'id',
      subId: 'id',
      content: content('Some text'),
      foo: 'bar',
      baz: 'banana'
    }
    assertEquals(block3, expected3)

    const block4 = block('{title} Some text')
    const expected4 = {
      type: 'title',
      content: content('Some text')
    }
    assertEquals(block4, expected4)

    const block5 = block('{#n1} Some text')
    const expected5 = {
      type: 'note',
      id: 'n1',
      subId: 'n1',
      content: content('Some text')
    }
    assertEquals(block5, expected5)

    assertThrows(() => {
      block('{#id,foo=bar,bazbanana} Some text')
    }, Error, 'Malformed property "bazbanana".')
  }
})
