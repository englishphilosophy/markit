import { parse } from "@std/yaml";

export default (path: string, head: string): [string, string[]] => {
  const errors: string[] = [];

  let stub: Record<string, unknown> = {};
  try {
    stub = (parse(head) ?? {}) as Record<string, unknown>;

    if (typeof stub.id !== "string") {
      errors.push(`bad or missing id (${path})`);
    }

    if (stub.texts !== undefined) {
      if (
        !Array.isArray(stub.texts) ||
        !stub.texts.every((text) => typeof text === "string")
      ) {
        errors.push(
          `bad texts array (${typeof stub.id === "string" ? stub.id : path})`
        );
      }
    }
  } catch {
    errors.push(`invalid yaml metadata (${path})`);
  }

  return [typeof stub.id === "string" ? stub.id : path, errors];
};
