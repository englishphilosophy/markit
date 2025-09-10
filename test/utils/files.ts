import { ensureDir } from "@std/fs";
import { dirname } from "@std/path";
import { type ContentOptions, createContent } from "./markit.ts";

type File = { path: string } & ContentOptions;

export const directory = "./test/files";

export const createFiles = async (...files: File[]) => {
  await deleteFiles();
  for await (const { path, ...contentOptions } of files) {
    const content = createContent(contentOptions);
    await ensureDir(dirname(`${directory}/${path}`));
    await Deno.writeTextFile(`${directory}/${path}`, content);
  }
};

export const deleteFiles = async () => {
  try {
    await Deno.remove(directory, { recursive: true });
  } catch {
    // ignore
  }
  try {
    await Deno.remove(directory, { recursive: true });
  } catch {
    // ignore
  }
};
