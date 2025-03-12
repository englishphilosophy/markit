import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import compileMarkit from "../src/markit.ts";
import { createContent } from "./utils.ts";
import type { Markit, Stub } from "../src/types.ts";

describe("markit", () => {
  it("handles a simple example", () => {
    const content = createContent(
      "---",
      "id: Test.Document",
      "metadata: some example metadata",
      "---",
      "{#1}",
      "First paragraph."
    );

    const actual = compileMarkit(content, "txt", []);
    const expected: Markit = {
      id: "Test.Document",
      metadata: "some example metadata",
      texts: [],
      blocks: [
        {
          id: "Test.Document.1",
          subId: "1",
          type: "paragraph",
          content: "First paragraph.",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("includes children metadata from context", () => {
    const content = createContent(
      "---",
      "id: Test.Document",
      "texts:",
      "  - Test.Document.1",
      "  - Test.Document.2",
      "---"
    );
    const context: Stub[] = [
      {
        id: "Test.Document.1",
        title: "Section 1",
      },
      {
        id: "Test.Document.2",
        title: "Section 2",
      },
    ];

    const actual = compileMarkit(content, "txt", context);
    const expected: Markit = {
      id: "Test.Document",
      texts: [
        { id: "Test.Document.1", title: "Section 1" },
        { id: "Test.Document.2", title: "Section 2" },
      ],
      blocks: [],
    };

    assertEquals(actual, expected);
  });

  it("adds previous and next texts metadata from context", () => {
    const content = createContent("---", "id: Test.Parent.Child", "---");
    const context: Stub[] = [
      { id: "Test.Parent.Previous", title: "Previous Document" },
      { id: "Test.Parent.Next", title: "Next Document" },
      {
        id: "Test.Parent",
        texts: [
          "Test.Parent.Previous",
          "Test.Parent.Child",
          "Test.Parent.Next",
        ],
      },
    ];

    const actual = compileMarkit(content, "txt", context);
    const expected: Markit = {
      id: "Test.Parent.Child",
      previous: { id: "Test.Parent.Previous", title: "Previous Document" },
      next: { id: "Test.Parent.Next", title: "Next Document" },
      texts: [],
      blocks: [],
    };

    assertEquals(actual, expected);
  });
});
