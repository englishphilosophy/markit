import { assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import markit from "./compiler.ts";
import compileMarkit from "./compiler/markit.ts";
import {
  createContent,
  createFiles,
  deleteFiles,
  inputDir,
  outputDir,
  readOutputFile,
} from "./test-utils.ts";

describe("markit cli", () => {
  beforeEach(deleteFiles);
  afterEach(deleteFiles);

  it("converts a single file", async () => {
    // arrange
    const path = "test-file.mit";
    const content = createContent(
      "---",
      "id: Test.Document",
      "---",
      "{#1} Block 1",
      "",
      "{#2} Block 2"
    );
    await createFiles({ path, content });

    // act
    const filesConverted = await markit(inputDir, outputDir);

    // assert
    assertEquals(filesConverted, 1);
    assertEquals(
      await readOutputFile(path, "txt"),
      compileMarkit(content, "txt")
    );
    assertEquals(
      await readOutputFile(path, "html"),
      compileMarkit(content, "html")
    );
  });

  it("converts all files in a directory", async () => {
    // arrange
    const paths = [
      "test-file1.mit",
      "test-file2.mit",
      "dir1/test-file.mit",
      "dir2/test-file.mit",
    ];
    const content = createContent(
      "---",
      "id: Test.Document",
      "---",
      "{#1} Block 1",
      "",
      "{#2} Block 2"
    );
    await createFiles(...paths.map((path) => ({ path, content })));

    // act
    const filesConverted = await markit(inputDir, outputDir);

    // assert
    assertEquals(filesConverted, 4);
    for await (const path of paths) {
      assertEquals(
        await readOutputFile(path, "txt"),
        compileMarkit(content, "txt")
      );
      assertEquals(
        await readOutputFile(path, "html"),
        compileMarkit(content, "html")
      );
    }
  });
});
