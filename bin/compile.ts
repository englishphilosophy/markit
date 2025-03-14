import { exists } from "@std/fs";
import compile from "../src/compiler.ts";

export default async (inputDir: string, outputDir: string) => {
  if (!inputDir) {
    console.error(
      "specify an input directory ('markit compile [inputDir] [outputDir]')"
    );
    Deno.exit(1);
  }

  if (!outputDir) {
    console.error(
      "specify an output directory ('markit compile [inputDir] [outputDir]')"
    );
    Deno.exit(1);
  }

  const inputDirExists = await exists(inputDir);
  if (!inputDirExists) {
    console.error(`input directory ${inputDir} does not exist`);
    Deno.exit(1);
  }

  console.log("compiling Markit files...");
  const result = await compile(inputDir, outputDir);
  console.log(`${result} files compiled and written to '${outputDir}'`);
  Deno.exit(0);
};
