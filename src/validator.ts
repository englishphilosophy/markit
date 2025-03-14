import { readContext, readMitPaths } from "./compiler.ts";
import validateContext from "./validator/context.ts";
import validateMarkit from "./validator/markit.ts";

export default async (inputDir: string): Promise<string[]> => {
  const mits = await readMitPaths(inputDir);
  const context = await readContext(mits);
  const errors = validateContext(context);
  for await (const path of mits) {
    const content = await Deno.readTextFile(path);
    errors.push(...validateMarkit(path, content));
  }
  return errors;
};
