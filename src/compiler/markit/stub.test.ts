import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { createContent } from "../../test-utils.ts";
import type { Stub } from "../../types.ts";
import compileStub from "./stub.ts";

describe("stub", () => {
  it("parses yaml metadata", () => {
    const content = createContent(
      "id: Test.Document",
      "string: this is a string",
      "number: 42",
      "array: [1982, 1983, 1984]",
      "longtext: >",
      "  this is a longer piece of text",
      "  spanning multiple lines"
    );

    const actual = compileStub(content, []);
    const expected: Stub = {
      id: "Test.Document",
      string: "this is a string",
      number: 42,
      array: [1982, 1983, 1984],
      longtext: "this is a longer piece of text spanning multiple lines\n",
    };

    assertEquals(actual, expected);
  });

  it("includes metadata from ancestors in the context", () => {
    const content = createContent("id: Test.Document.Child.Grandchild");
    const context: Stub[] = [
      { id: "Test.Document", grandparent: "metadata" },
      { id: "Test.Document.Child", parent: "metadata" },
    ];

    const actual = compileStub(content, context);
    const expected: Stub = {
      id: "Test.Document.Child.Grandchild",
      parent: "metadata",
      grandparent: "metadata",
    };

    assertEquals(actual, expected);
  });

  it("doesn't inherit texts from ancestors in the context", () => {
    const content = createContent("id: Test.Document.Child");
    const context: Stub[] = [
      { id: "Test.Document", texts: ["Test.Document.Child"] },
    ];

    const actual = compileStub(content, context);
    const expected: Stub = { id: "Test.Document.Child" };

    assertEquals(actual, expected);
  });
});
