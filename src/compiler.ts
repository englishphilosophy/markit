import { ensureDir, exists } from "@std/fs";
import { dirname, extname } from "@std/path";
import compileMarkit, { compileBaseStub } from "./compiler/markit.ts";
import type { Format, Markit, Stub } from "./types.ts";

export default async (inputDir: string, outputDir: string): Promise<number> => {
  const mits = await readMitPaths(inputDir);
  if (await exists(outputDir)) {
    await Deno.remove(outputDir, { recursive: true });
  }
  await ensureDir(outputDir);
  const context = await readContext(mits);
  for await (const path of mits) {
    const content = await Deno.readTextFile(path);
    const txt = compileMarkit(content, "txt", context);
    const html = compileMarkit(content, "html", context);
    await writeMarkitToDisk(inputDir, outputDir, path, "txt", txt);
    await writeMarkitToDisk(inputDir, outputDir, path, "html", html);
  }
  return mits.length;
};

export const readMitPaths = async (directory: string) => {
  const mitFiles: string[] = [];
  for await (const dirEntry of Deno.readDir(directory)) {
    const fullPath = `${directory}/${dirEntry.name}`;
    if (dirEntry.isDirectory) {
      mitFiles.push(...(await readMitPaths(fullPath)));
    } else if (dirEntry.isFile && extname(fullPath) === ".mit") {
      mitFiles.push(fullPath);
    }
  }
  return mitFiles;
};

export const readContext = (mits: string[]): Promise<Stub[]> =>
  Promise.all(
    mits.map(async (mit) => {
      const content = await Deno.readTextFile(mit);
      return compileBaseStub(content);
    })
  );

const writeMarkitToDisk = async (
  inputDir: string,
  outputDir: string,
  path: string,
  format: Format,
  markit: Markit
) => {
  const outputPath = path.replace(inputDir, "").replace(/.mit$/, ".json");
  const outputFullPath = `${outputDir}/${format}/${outputPath}`;
  await ensureDir(dirname(outputFullPath));
  await Deno.writeTextFile(outputFullPath, JSON.stringify(markit, null, 2));
};
