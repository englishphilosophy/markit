import compile from "../src/compile.ts";
import validate from "../src/validate.ts";

const [command, inputDir, outputDir] = Deno.args;

if (!command) {
  console.error("specify a command ('compile' or 'validate')");
  Deno.exit(1);
}

if (command !== "compile" && command !== "validate") {
  console.error(
    `command '${command}' not recognised (must be either 'compile' or 'validate')`
  );
  Deno.exit(1);
}

switch (command) {
  case "compile":
    compile(inputDir, { outputDirectory: outputDir });
    break;

  case "validate":
    validate(inputDir, { logErrors: true });
    break;
}
