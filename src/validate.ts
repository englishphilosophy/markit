import { exists } from "@std/fs";
import getContext, { readMitPaths } from "./context.ts";
import { validateContext, validateMarkit } from "./lib/validate.ts";
import type { ValidateOptions } from "./types.ts";

export default async (
  path: string,
  options: Partial<ValidateOptions> = {}
): Promise<string[]> => {
  // merge specified options with defaults
  const opts = { ...defaultOptions, ...options };

  // check input path
  const isFile = await exists(path, { isFile: true });
  const isDir = await exists(path, { isDirectory: true });
  if (!isFile && !isDir) {
    throw new Error(`Path "${path}" does not exist`);
  }

  // create errors array
  const errors: string[] = [];

  // get context
  const context = await getContext(
    opts.contextDirectory,
    opts.clearContextCache
  );

  // validate context
  errors.push(...validateContext(context));

  // validate markit file(s)
  if (isFile) {
    // validate single file
    const content = await Deno.readTextFile(path);
    errors.push(...validateMarkit(path, content));
  } else {
    // validate all markit files in the input directory
    const mits = await readMitPaths(path);
    for await (const path of mits) {
      const content = await Deno.readTextFile(path);
      errors.push(...validateMarkit(path, content));
    }
  }

  // maybe log errors
  if (opts.logErrors) {
    console.log(`Found ${errors.length} errors in ${path}:`);
    for (const error of errors) {
      console.log(`  - ${error}`);
    }
  }

  // return the errors
  return errors;
};

const defaultOptions: ValidateOptions = {
  contextDirectory: null,
  logErrors: false,
  clearContextCache: false,
};
