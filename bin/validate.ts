import { exists } from "@std/fs";
import validate from "../src/validator.ts";

export default async (inputDir: string) => {
  if (!inputDir) {
    console.error("specify an input directory ('markit validate inputDir')");
    Deno.exit(1);
  }

  const inputDirExists = await exists(inputDir);
  if (!inputDirExists) {
    console.error(`input directory ${inputDir} does not exist`);
    Deno.exit(1);
  }

  console.log("Running Markit...");
  const errors = await validate(inputDir);
  if (errors.length === 0) {
    console.log("no errors found");
  } else {
    console.log(
      `${errors.length === 1 ? "1 error" : `${errors.length} errors`} found`
    );
    errors.forEach((error) => console.error(error));
  }
  Deno.exit(0);
};
