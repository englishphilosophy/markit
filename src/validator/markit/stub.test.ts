import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { createContent } from "../../test-utils.ts";
import validateStub from "./stub.ts";

describe("stub", () => {
  it("returns correct id for clearer error message elsewhere", () => {
    const content = createContent("id: Test.Document");
    const [id] = validateStub("filePath", content);
    assertEquals(id, "Test.Document");
  });

  it("invalidates bad yaml metadata", () => {
    const content = createContent('badProperty: "this string is unterminated');
    const [, errors] = validateStub("filePath", content);
    assertEquals(errors, ["invalid yaml metadata (filePath)"]);
  });

  it("invalidates bad id", () => {
    const content1 = createContent("id: 12");
    const [, errors1] = validateStub("filePath", content1);
    assertEquals(errors1, ["bad or missing id (filePath)"]);

    const content2 = createContent("no: id here");
    const [, errors2] = validateStub("filePath", content2);
    assertEquals(errors2, ["bad or missing id (filePath)"]);
  });

  it("invalidates bad texts", () => {
    const content1 = createContent(
      "id: Test.Document",
      "texts: this is not an array"
    );
    const [, errors1] = validateStub("filePath", content1);
    assertEquals(errors1, ["bad texts array (Test.Document)"]);

    const content2 = createContent(
      "id: Test.Document",
      "texts:",
      "  - not all string here",
      "  - true",
      "  - 42"
    );
    const [, errors2] = validateStub("filePath", content2);
    assertEquals(errors2, ["bad texts array (Test.Document)"]);
  });
});
