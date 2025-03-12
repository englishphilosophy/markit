import { assertEquals } from "@std/assert";
import { describe, it, test } from "@std/testing/bdd";
import type { Stub } from "../src/types.ts";
import {
  getParent,
  getPrevious,
  getNext,
  getChildren,
} from "../src/context.ts";

describe("context", () => {
  it("finds parent text", () => {
    const parent: Stub = { id: "Test.Document" };
    const context = [parent];

    const actual = getParent("Test.Document.Child", context);

    assertEquals(actual, parent);
  });

  it("finds next text", () => {
    const parent: Stub = {
      id: "Test.Document",
      texts: ["Test.Document.1", "Test.Document.2"],
    };
    const child = { id: "Test.Document.1" };
    const next = { id: "Test.Document.2" };
    const context = [parent, child, next];

    const actual = getNext("Test.Document.1", context);

    assertEquals(actual, next);
  });

  it("finds previous text", () => {
    const parent: Stub = {
      id: "Test.Document",
      texts: ["Test.Document.1", "Test.Document.2"],
    };
    const child = { id: "Test.Document.2" };
    const previous = { id: "Test.Document.1" };
    const context = [parent, child, previous];

    const actual = getPrevious("Test.Document.2", context);

    assertEquals(actual, previous);
  });

  it("finds child texts", () => {
    const parent: Stub = {
      id: "Test.Document",
      texts: ["Test.Document.1", "Test.Document.2"],
    };
    const children = [{ id: "Test.Document.1" }, { id: "Test.Document.2" }];
    const context = [parent, ...children];

    const actual = getChildren(parent, context);

    assertEquals(actual, children);
  });
});
