import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { createContent } from "../../test/utils/markit.ts";
import type { Markit, Stub } from "../types.ts";
import compile from "./compile.ts";

describe("compile", () => {
  it("handles a simple example", () => {
    const content = createContent({
      id: "Test.Document",
      blocks: ["{#1} First paragraph."],
    });

    const actual = compile(content);
    const expected: Markit = {
      id: "Test.Document",
      ancestors: [],
      children: [],
      blocks: [
        {
          id: "Test.Document.1",
          type: "paragraph",
          text: "First paragraph.",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("parses metadata in the header", () => {
    const content = createContent({
      id: "Test.Document",
      metadata: {
        string: "this is a string",
        number: "42",
        array: "[1982, 1983, 1984]",
      },
    });

    const actual = compile(content, []);
    const expected: Markit = {
      id: "Test.Document",
      string: "this is a string",
      number: 42,
      array: [1982, 1983, 1984],
      ancestors: [],
      children: [],
      blocks: [],
    };

    assertEquals(actual, expected);
  });

  it("includes metadata from ancestors in the context", () => {
    const content = createContent({
      id: "Test.Document.Child.Grandchild",
    });
    const context: Stub[] = [
      { id: "Test.Document", grandparent: "metadata" },
      { id: "Test.Document.Child", parent: "metadata" },
    ];

    const actual = compile(content, context);
    const expected: Markit = {
      id: "Test.Document.Child.Grandchild",
      parent: "metadata",
      grandparent: "metadata",
      ancestors: [
        { id: "Test.Document", grandparent: "metadata" },
        { id: "Test.Document.Child", parent: "metadata" },
      ],
      children: [],
      blocks: [],
    };

    assertEquals(actual, expected);
  });

  it("includes children metadata from context", () => {
    const content = createContent({
      id: "Test.Document",
      texts: ["Test.Document.1", "Test.Document.2"],
    });
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

    const actual = compile(content, context);
    const expected: Markit = {
      id: "Test.Document",
      ancestors: [],
      children: [
        { id: "Test.Document.1", title: "Section 1" },
        { id: "Test.Document.2", title: "Section 2" },
      ],
      blocks: [],
    };

    assertEquals(actual, expected);
  });

  it("adds previous and next texts metadata from context", () => {
    const content = createContent({ id: "Test.Parent.Child" });
    const context: Stub[] = [
      {
        id: "Test.Parent",
        texts: [
          "Test.Parent.Previous",
          "Test.Parent.Child",
          "Test.Parent.Next",
        ],
      },
      { id: "Test.Parent.Previous", title: "Previous Document" },
      { id: "Test.Parent.Next", title: "Next Document" },
    ];

    const actual = compile(content, context, "markit");
    const expected: Markit = {
      id: "Test.Parent.Child",
      ancestors: [{ id: "Test.Parent" }],
      children: [],
      previous: { id: "Test.Parent.Previous", title: "Previous Document" },
      next: { id: "Test.Parent.Next", title: "Next Document" },
      blocks: [],
    };

    assertEquals(actual, expected);
  });

  it("parses body text into separate blocks", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: [
        "The first block.",
        "",
        "The second block. This one",
        "is split over multiple lines.",
        "",
        "For good measure, here is a",
        "third block split over three",
        "lines.",
      ],
    });

    const actual = compile(content);
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id: `${id}.0`,
          type: "paragraph",
          text: "The first block.",
        },
        {
          id: `${id}.1`,
          type: "paragraph",
          text: "The second block. This one is split over multiple lines.",
        },
        {
          id: `${id}.2`,
          type: "paragraph",
          text: "For good measure, here is a third block split over three lines.",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("parses title blocks", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: ["{title}", "£1 Title of the Text £1"],
    });

    const actual = compile(content);
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id,
          type: "title",
          text: "£1 Title of the Text £1",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("parses paragraph blocks", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: ["{#1}", "First paragraph."],
    });

    const actual = compile(content);
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id: `${id}.1`,
          type: "paragraph",
          text: "First paragraph.",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("parses footnote blocks", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: ["{#n1}", "Footnote text."],
    });

    const actual = compile(content);
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id: `${id}.n1`,
          type: "note",
          text: "Footnote text.",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("parses paragraph metadata", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: ["{#1,property1=value1,property2=value2}", "Paragraph text."],
    });

    const actual = compile(content);
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id: `${id}.1`,
          type: "paragraph",
          property1: "value1",
          property2: "value2",
          text: "Paragraph text.",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("leaves markit in place by default", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: ["Paragraph text with _some_ *simple* markup."],
    });

    const actual = compile(content);
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id: `${id}.0`,
          type: "paragraph",
          text: "Paragraph text with _some_ *simple* markup.",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("compiles markit to html", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: ["Paragraph text with _some_ *simple* markup."],
    });

    const actual = compile(content, [], "html");
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id: `${id}.0`,
          type: "paragraph",
          text: "<p>Paragraph text with <em>some</em> <strong>simple</strong> markup.</p>",
        },
      ],
    };

    assertEquals(actual, expected);
  });

  it("strips markit to plain text", () => {
    const id = "Test.Document";
    const content = createContent({
      id,
      lines: ["Paragraph text with _some_ *simple* markup."],
    });

    const actual = compile(content, [], "text");
    const expected: Markit = {
      id,
      ancestors: [],
      children: [],
      blocks: [
        {
          id: `${id}.0`,
          type: "paragraph",
          text: "Paragraph text with some simple markup.",
        },
      ],
    };

    assertEquals(actual, expected);
  });
});
