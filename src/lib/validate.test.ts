import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import {
  assertHeadContentGivesErrors,
  assertBlockContentGivesErrors,
  assertFullContentGivesErrors,
} from "../../test/utils/validation.ts";
import type { Stub } from "../types.ts";
import { validateContext } from "./validate.ts";

describe("validateContext", () => {
  it("invalidates missing parent texts", () => {
    const context: Stub[] = [
      {
        id: "Parent.Child",
      },
    ];

    const errors = validateContext(context);
    assertEquals(errors, [
      "parent text Parent missing in context (Parent.Child)",
    ]);
  });

  it("invalidates missing child texts", () => {
    const context: Stub[] = [
      {
        id: "Parent",
        texts: ["Parent.Child1", "Parent.Child2"],
      },
    ];

    const errors = validateContext(context);
    assertEquals(errors, [
      "child text Parent.Child1 missing in context (Parent)",
      "child text Parent.Child2 missing in context (Parent)",
    ]);
  });
});

describe("validateMarkit", () => {
  it("invalidates bad yaml metadata", () => {
    assertHeadContentGivesErrors({
      filePath: "filePath",
      headContent: ["badProperty: 'this string is unterminated"],
      expectedErrors: ["invalid yaml metadata (filePath)"],
    });
  });

  it("invalidates missing id", () => {
    assertHeadContentGivesErrors({
      filePath: "filePath",
      headContent: ["no: id here"],
      expectedErrors: ["bad or missing id (filePath)"],
    });
  });

  it("invalidates non-string id", () => {
    assertHeadContentGivesErrors({
      filePath: "filePath",
      headContent: ["id: 12"],
      expectedErrors: ["bad or missing id (filePath)"],
    });
  });

  it("invalidates texts that are not an array", () => {
    assertHeadContentGivesErrors({
      filePath: "filePath",
      headContent: ["id: Test.Document", "texts: this is not an array"],
      expectedErrors: ["bad texts array (Test.Document)"],
    });
  });

  it("invalidates texts arrays that are not all strings", () => {
    assertHeadContentGivesErrors({
      filePath: "filePath",
      headContent: [
        "id: Test.Document",
        "texts:",
        "  - not all string here",
        "  - true",
        "  - 42",
      ],
      expectedErrors: ["bad texts array (Test.Document)"],
    });
  });

  it("invalidates malformed paragraph properties", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "{property=}",
      expectedErrors: ["malformed paragraph property (id)"],
    });
  });

  it("includes paragraph id in error message", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "{#1,property=}",
      expectedErrors: ["malformed paragraph property (id.1)"],
    });
  });

  it("invalidates escape character that escapes nothing", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "\\",
      expectedErrors: ["content cannot end with '\\' (id)"],
    });
  });

  it("invalidates headings with no number", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "£ title £",
      expectedErrors: ["bad heading tags (id)"],
    });
  });

  it("invalidates headings with numbers not between 1 and 6", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "£0 title £0",
      expectedErrors: ["bad heading tags (id)"],
    });
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "£7 title £7",
      expectedErrors: ["bad heading tags (id)"],
    });
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "£8 title £8",
      expectedErrors: ["bad heading tags (id)"],
    });
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "£100 title £100",
      expectedErrors: ["bad heading tags (id)"],
    });
  });

  it("invalidates headings with mismatched numbers", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "£1 title £2",
      expectedErrors: ["mismatched heading tags (id)"],
    });
  });

  it("invalidates unterminated block quotations", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: '""test',
      expectedErrors: ["unterminated block quotation (id)"],
    });
  });

  it("invalidates unterminated inline quotations", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: '"test',
      expectedErrors: ["unterminated inline quotation (id)"],
    });
  });

  it("invalidates unterminated strong text", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "*test",
      expectedErrors: ["unterminated '*' tag (id)"],
    });
  });

  it("invalidates unterminated emphasised text", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "_test",
      expectedErrors: ["unterminated '_' tag (id)"],
    });
  });

  it("invalidates unterminated small caps", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "^test",
      expectedErrors: ["unterminated '^' tag (id)"],
    });
  });

  it("invalidates unterminated name", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "=test",
      expectedErrors: ["unterminated '=' tag (id)"],
    });
  });

  it("invalidates unterminated foreign text", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "$test",
      expectedErrors: ["unterminated '$' tag (id)"],
    });
  });

  it("invalidates unterminated greek text", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "$$test",
      expectedErrors: ["unterminated '$$' tag (id)"],
    });
  });

  it("invalidates unterminated margin comments", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "#test",
      expectedErrors: ["unterminated '#' tag (id)"],
    });
  });

  it("invalidates unrecognised ligatures", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "{foo=bar} {as}",
      expectedErrors: ["unrecognised ligature (id)"],
    });
  });

  it("invalidates unterminated editorial insertions", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "{++test",
      expectedErrors: ["unterminated '{++}' tag (id)"],
    });
  });

  it("invalidates unterminated editorial deletions", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "{--test",
      expectedErrors: ["unterminated '{--}' tag (id)"],
    });
  });

  it("invalidates unterminated editorial replacements", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "{~~old->new",
      expectedErrors: ["unterminated '{~~}' tag (id)"],
    });
  });

  it("invalidates unterminated footnotes/citations/links", () => {
    assertBlockContentGivesErrors({
      id: "id",
      blockContent: "{#1} [n1",
      expectedErrors: ["unterminated '[' tag (id.1)"],
    });
  });

  it("handles a case with multiple errors", () => {
    assertFullContentGivesErrors({
      filePath: "filePath",
      fullContent: [
        "---",
        "id: Test",
        "texts: not an array",
        "---",
        "{#1} _Unterminated italics",
        "",
        "{#2,property=} Bad property",
        "",
        "{#3} $Unterminated foreign text",
      ],
      expectedErrors: [
        "bad texts array (Test)",
        "unterminated '_' tag (Test.1)",
        "malformed paragraph property (Test.2)",
        "unterminated '$' tag (Test.3)",
      ],
    });
  });
});
