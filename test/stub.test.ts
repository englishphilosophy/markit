import { assertEquals } from "@std/assert";
import { describe, it, test } from "@std/testing/bdd";
import type { Stub } from "../src/types.ts";
import compileStub from "../src/stub.ts";
import { createContent } from "./utils.ts";

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

  it("adds id of 'missing-id' if id is missing", () => {
    const content = createContent("");

    const actual = compileStub(content, []);
    const expected = { id: "missing-id" };

    assertEquals(actual, expected);
  });

  it("discards texts if they're not an array of strings", () => {
    const content1 = createContent("id: Test.Document", "texts: 12");
    const content2 = createContent("id: Test.Document", "texts: [12, 13]");

    const actual1 = compileStub(content1, []);
    const actual2 = compileStub(content2, []);
    const expected: Stub = { id: "Test.Document" };

    assertEquals(actual1, expected);
    assertEquals(actual2, expected);
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
