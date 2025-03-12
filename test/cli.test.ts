import { assertEquals } from "@std/assert";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import markit from "../src/cli.ts";
import compileMarkit from "../src/markit.ts";
import {
  createContent,
  createFiles,
  deleteFiles,
  inputDir,
  outputDir,
  readOutputFile,
} from "./utils.ts";

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

  it("includes parent metadata in child texts", async () => {
    // arrange
    const parentPath = "parent.mit";
    const childPath = "parent/child.mit";
    const parentContent = createContent(
      "---",
      "id: Parent.Document",
      "parent: metadata",
      "texts:",
      "  - child.mit",
      "---"
    );
    const childContent = createContent("---", "id: Child.Document", "---");
    await createFiles(
      { path: parentPath, content: parentContent },
      { path: childPath, content: childContent }
    );
    const context = [compileMarkit(parentContent, "txt"), compileMarkit(childContent, "txt")];

    // act
    const filesConverted = await markit(inputDir, outputDir);

    // assert
    assertEquals(filesConverted, 2);

    const childTextObject = await readOutputFile(childPath, "txt");
    assertEquals(
      childTextObject,
      compileMarkit(childContent, "txt", context)
    );
  });

  // it("includes child metadata in parent texts", async () => {
  //   // arrange
  //   const parentPath = "parent.mit";
  //   const child1Path = "parent/child1.mit";
  //   const child2Path = "parent/child2.mit";
  //   const parentContent = createContent(
  //     "---",
  //     "id: Parent.Document",
  //     "texts:",
  //     "  - parent/child1.mit",
  //     "  - parent/child2.mit",
  //     "---"
  //   );
  //   const child1Content = createContent(
  //     "---",
  //     "id: Parent.Document.Child1",
  //     "child1: metadata",
  //     "---"
  //   );
  //   const child2Content = createContent(
  //     "---",
  //     "id: Parent.Document.Child2",
  //     "child2: metadata",
  //     "---"
  //   );
  //   await createFiles(
  //     { path: parentPath, content: parentContent },
  //     { path: child1Path, content: child1Content },
  //     { path: child2Path, content: child2Content }
  //   );

  //   // act
  //   const filesConverted = await markit(inputDir, outputDir);

  //   // assert
  //   assertEquals(filesConverted, 2);

  //   const parentTextObject = await readOutputFile(parentPath, "txt");
  //   const child1TextObject = await readOutputFile(child1Path, "txt");
  //   const child2TextObject = await readOutputFile(child2Path, "txt");
  //   assertEquals(
  //     parentTextObject,
  //     compileMarkit({
  //       content: parentContent,
  //       format: "txt",
  //       context: parentTextObject,
  //       children: {
  //         child1Path: child1TextObject,
  //         child2Path: child2TextObject,
  //       },
  //     })
  //   );
  // });

  // Deno.test("includes previous and next metadata in texts", async () => {
  //   // todo
  // });
});
