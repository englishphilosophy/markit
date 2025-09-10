import { exists } from "@std/fs";
import getContext, { readMitPaths } from "./context.ts";
import compile from "./lib/compile.ts";
import type { CompileOptions, Markit } from "./types.ts";

export default async (
  path: string,
  options: Partial<CompileOptions> = {}
): Promise<Markit[]> => {
  // merge specified options with defaults
  const opts = { ...defaultOptions, ...options };

  // check input path
  const isFile = await exists(path, { isFile: true });
  const isDir = await exists(path, { isDirectory: true });
  if (!isFile && !isDir) {
    throw new Error(`Path "${path}" does not exist`);
  }

  // create texts array
  const texts: Markit[] = [];

  // get context
  const context = await getContext(
    opts.contextDirectory,
    opts.clearContextCache
  );

  // compile markit file(s)
  if (isFile) {
    // compile single file
    const mit = await Deno.readTextFile(path);
    const text = compile(mit, context, opts.format);
    texts.push(text);

    // write text to output file - TODO: fix this
    if (opts.outputDirectory) {
      const outputPath = `${opts.outputDirectory}/${path}`;
      await Deno.writeTextFile(outputPath, JSON.stringify(text));
    }
  } else {
    // compile all files in the input directory
    const mits = await readMitPaths(path);
    for await (const path of mits) {
      const mit = await Deno.readTextFile(path);
      const text = compile(mit, context, opts.format);
      texts.push(text);

      // write text to output file - TODO: fix this
      if (opts.outputDirectory) {
        const outputPath = `${opts.outputDirectory}/${path}`;
        await Deno.writeTextFile(outputPath, JSON.stringify(text));
      }
    }
  }

  // return the texts
  return texts;
};

const defaultOptions: CompileOptions = {
  contextDirectory: null,
  format: "markit",
  outputDirectory: null,
  emptyOutputDirectory: true,
  clearContextCache: false,
};
