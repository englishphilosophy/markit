import markit from "../src/markit.ts";
import type { Markit } from "../src/types.ts";
import { assertEquals } from "@std/assert";

Deno.test("markit parses yaml metadata", () => {
  const input = [
    "---",
    "id: Test.Document",
    "string: this is a string",
    "number: 42",
    "array: [1982, 1983, 1984]",
    "longtext: >",
    "  this is a longer piece of text",
    "  spanning multiple lines",
    "---",
  ].join("\n");

  const expectedOutput: Markit = {
    id: "Test.Document",
    string: "this is a string",
    number: 42,
    array: [1982, 1983, 1984],
    longtext: "this is a longer piece of text spanning multiple lines\n",
    blocks: [], // these are always present
  };

  assertEquals(markit(input), expectedOutput);
});

Deno.test("markit parses body text into blocks", () => {
  const input = [
    "The first block.",
    "",
    "The second block. This one",
    "is split over multiple lines.",
    "",
    "For good measure, here is a",
    "third block split over three",
    "lines.",
  ].join("\n");

  const expectedOutput: Markit = {
    blocks: [
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
    ],
  };

  assertEquals(markit(input), expectedOutput);
});

Deno.test("markit parses title blocks", () => {
  const input = [
    "---",
    "id: Test.Document",
    "---",
    "{title}",
    "Title of the Text",
  ].join("\n");

  const expectedOutput: Markit = {
    id: "Test.Document",
    blocks: [
      { type: "title", id: "Test.Document", content: "Title of the Text" },
    ],
  };

  assertEquals(markit(input), expectedOutput);
});

Deno.test("markit parses paragraph blocks", () => {
  const input = [
    "---",
    "id: Test.Document",
    "---",
    "{#1}",
    "First paragraph.",
  ].join("\n");

  const expectedOutput: Markit = {
    id: "Test.Document",
    blocks: [
      {
        type: "paragraph",
        id: "Test.Document.1",
        subId: "1",
        content: "First paragraph.",
      },
    ],
  };

  assertEquals(markit(input), expectedOutput);
});

Deno.test("markit parses footnote blocks", () => {
  const input = [
    "---",
    "id: Test.Document",
    "---",
    "{#n1}",
    "Footnote text.",
  ].join("\n");

  const expectedOutput: Markit = {
    id: "Test.Document",
    blocks: [
      {
        type: "note",
        id: "Test.Document.n1",
        subId: "n1",
        content: "Footnote text.",
      },
    ],
  };

  assertEquals(markit(input), expectedOutput);
});

Deno.test("markit parses paragraph metadata", () => {
  const input = [
    "---",
    "id: Test.Document",
    "---",
    "{#1,property1=value1,property2=value2}",
    "Paragraph text.",
  ].join("\n");

  const expectedOutput: Markit = {
    id: "Test.Document",
    blocks: [
      {
        type: "paragraph",
        id: "Test.Document.1",
        subId: "1",
        property1: "value1",
        property2: "value2",
        content: "Paragraph text.",
      },
    ],
  };

  assertEquals(markit(input), expectedOutput);
});
