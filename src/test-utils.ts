import { ensureDir } from "@std/fs";
import { dirname } from "@std/path";
import type { Markit } from "./types.ts";

export const inputDir = "./test_files_in";

export const outputDir = "./test_files_out";

export const createContent = (...lines: string[]) => lines.join("\n");

export const createFiles = async (
  ...files: { path: string; content: string }[]
) => {
  await deleteFiles();
  for await (const file of files) {
    await ensureDir(dirname(`${inputDir}/${file.path}`));
    await Deno.writeTextFile(`${inputDir}/${file.path}`, file.content);
  }
};

export const deleteFiles = async () => {
  try {
    await Deno.remove(inputDir, { recursive: true });
  } catch {
    // ignore
  }
  try {
    await Deno.remove(outputDir, { recursive: true });
  } catch {
    // ignore
  }
};

export const readOutputFile = async (
  path: string,
  format: "txt" | "html"
): Promise<Markit> => {
  const textFile = await Deno.readTextFile(
    `${outputDir}/${format}/${path.replace(/.mit$/, ".json")}`
  );
  return JSON.parse(textFile);
};
