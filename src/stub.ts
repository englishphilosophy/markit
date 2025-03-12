import { parse } from "@std/yaml";
import { getParent } from "./context.ts";
import type { Stub } from "./types.ts";

export default (head: string, context: Stub[]): Stub => {
  const stub = (parse(head) ?? {}) as Stub;

  // id is required and must be a string
  stub.id = typeof stub.id === "string" ? stub.id : "missing-id";

  // texts is optional, but must be an array of strings if present
  if (stub.texts !== undefined) {
    if (
      !Array.isArray(stub.texts) ||
      !stub.texts.every((text) => typeof text === "string")
    ) {
      delete stub.texts;
    }
  }

  // inherit metadata from ancestors in the context
  return enrichMetadataWithContext(stub, context);
};

const enrichMetadataWithContext = (stub: Stub, context: Stub[]): Stub => {
  const parent = getParent(stub.id, context);

  if (parent) {
    const { texts: _texts, ...parentWithoutTexts } = parent;
    return {
      ...enrichMetadataWithContext(parentWithoutTexts, context),
      ...parentWithoutTexts,
      ...stub,
    };
  }

  return stub;
};
