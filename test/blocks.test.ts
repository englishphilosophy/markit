import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import type { Block } from "../src/types.ts";
import compileBlocks from "../src/blocks.ts";
import { createContent } from "./utils.ts";

describe("blocks", () => {
  it("parses body text into blocks", () => {
    const id = "Test.Document";
    const content = createContent(
      "The first block.",
      "",
      "The second block. This one",
      "is split over multiple lines.",
      "",
      "For good measure, here is a",
      "third block split over three",
      "lines."
    );

    const actual = compileBlocks(id, content, "txt");
    const expected: Block[] = [
      { type: "paragraph", content: "The first block." },
      {
        type: "paragraph",
        content: "The second block. This one is split over multiple lines.",
      },
      {
        type: "paragraph",
        content:
          "For good measure, here is a third block split over three lines.",
      },
    ];

    assertEquals(actual, expected);
  });

  it("parses title blocks", () => {
    const id = "Test.Document";
    const content = createContent("{title}", "Title of the Text");

    const actual = compileBlocks(id, content, "txt");
    const expected: Block[] = [
      { type: "title", id, content: "Title of the Text" },
    ];

    assertEquals(actual, expected);
  });

  it("parses paragraph blocks", () => {
    const id = "Test.Document";
    const content = createContent("{#1}", "First paragraph.");

    const actual = compileBlocks(id, content, "txt");
    const expected: Block[] = [
      {
        type: "paragraph",
        id: "Test.Document.1",
        subId: "1",
        content: "First paragraph.",
      },
    ];

    assertEquals(actual, expected);
  });

  it("parses footnote blocks", () => {
    const id = "Test.Document";
    const content = createContent("{#n1}", "Footnote text.");

    const actual = compileBlocks(id, content, "txt");
    const expected: Block[] = [
      {
        type: "note",
        id: "Test.Document.n1",
        subId: "n1",
        content: "Footnote text.",
      },
    ];

    assertEquals(actual, expected);
  });

  it("parses paragraph metadata", () => {
    const id = "Test.Document";
    const content = createContent(
      "{#1,property1=value1,property2=value2}",
      "Paragraph text."
    );

    const actual = compileBlocks(id, content, "txt");
    const expected: Block[] = [
      {
        type: "paragraph",
        id: "Test.Document.1",
        subId: "1",
        property1: "value1",
        property2: "value2",
        content: "Paragraph text.",
      },
    ];

    assertEquals(actual, expected);
  });

  it("parses paragraph content into plain text", () => {
    const id = "Test.Document";
    const content = createContent(
      "Paragraph text with _some_ *simple* markup."
    );

    const actual = compileBlocks(id, content, "txt");
    const expected: Block[] = [
      {
        type: "paragraph",
        content: "Paragraph text with some simple markup.",
      },
    ];

    assertEquals(actual, expected);
  });

  it("parses paragraph content into html", () => {
    const id = "Test.Document";
    const content = createContent(
      "Paragraph text with _some_ *simple* markup."
    );

    const actual = compileBlocks(id, content, "html");
    const expected: Block[] = [
      {
        type: "paragraph",
        content:
          "<p>Paragraph text with <em>some</em> <strong>simple</strong> markup.</p>",
      },
    ];

    assertEquals(actual, expected);
  });
});
