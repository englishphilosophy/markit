import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import validateBlocks from "./blocks.ts";

describe("validateBlocks", () => {
  it("invalidates malformed paragraph properties", () => {
    assertEquals(validateBlocks("id", "{property=}"), ["malformed paragraph property (id)"]);
  });

  it("includes paragraph id in error message", () => {
    assertEquals(validateBlocks("id", "{#1,property=}"), ["malformed paragraph property (id.1)"]);
  });

  it("invalidates escape character that escapes nothing", () => {
    assertEquals(validateBlocks("id", "\\"), ["content cannot end with '\\' (id)"]);
  });

  it("invalidates headings with no number", () => {
    assertEquals(validateBlocks("id", "£ title £"), ["bad heading tags (id)"]);
  });

  it("invalidates headings with numbers not between 1 and 6", () => {
    assertEquals(validateBlocks("id", "£0 title £0"), ["bad heading tags (id)"]);
    assertEquals(validateBlocks("id", "£7 title £7"), ["bad heading tags (id)"]);
    assertEquals(validateBlocks("id", "£8 title £8"), ["bad heading tags (id)"]);
    assertEquals(validateBlocks("id", "£100 title £100"), ["bad heading tags (id)"]);
  });

  it("invalidates headings with mismatched numbers", () => {
    assertEquals(validateBlocks("id", "£1 title £2"), ["mismatched heading tags (id)"]);
  });

  it("invalidates unterminated block quotations", () => {
    assertEquals(validateBlocks("id", '""test'), ["unterminated block quotation (id)"]);
  });

  it("invalidates unterminated inline quotations", () => {
    assertEquals(validateBlocks("id", '"test'), ["unterminated inline quotation (id)"]);
  });

  it("invalidates unterminated strong text", () => {
    assertEquals(validateBlocks("id", "*test"), ["unterminated '*' tag (id)"]);
  });

  it("invalidates unterminated emphasised text", () => {
    assertEquals(validateBlocks("id", "_test"), ["unterminated '_' tag (id)"]);
  });

  it("invalidates unterminated small caps", () => {
    assertEquals(validateBlocks("id", "^test"), ["unterminated '^' tag (id)"]);
  });

  it("invalidates unterminated name", () => {
    assertEquals(validateBlocks("id", "=test"), ["unterminated '=' tag (id)"]);
  });

  it("invalidates unterminated foreign text", () => {
    assertEquals(validateBlocks("id", "$test"), ["unterminated '$' tag (id)"]);
  });

  it("invalidates unterminated greek text", () => {
    assertEquals(validateBlocks("id", "$$test"), ["unterminated '$$' tag (id)"]);
  });

  it("invalidates unterminated margin comments", () => {
    assertEquals(validateBlocks("id", "#test"), ["unterminated '#' tag (id)"]);
  });

  it("invalidates unrecognised ligatures", () => {
    assertEquals(validateBlocks("id", "{foo=bar} {as}"), ["unrecognised ligature (id)"]);
  });

  it("invalidates unterminated editorial insertions", () => {
    assertEquals(validateBlocks("id", "{++test"), ["unterminated '{++}' tag (id)"]);
  });

  it("invalidates unterminated editorial deletions", () => {
    assertEquals(validateBlocks("id", "{--test"), ["unterminated '{--}' tag (id)"]);
  });

  it("invalidates unterminated editorial replacements", () => {
    assertEquals(validateBlocks("id", "{~~old->new"), ["unterminated '{~~}' tag (id)"]);
  });

  it("invalidates unterminated footnotes/citations/links", () => {
    assertEquals(validateBlocks("id", "[n1"), ["unterminated '[' tag (id)"]);
  });
});
