import { parse } from "@std/yaml";
import type { Stub } from "../../types.ts";
import { getParent } from "./context.ts";

export default (head: string, context: Stub[]): Stub => {
  let stub = {} as Stub;
  try {
    stub = parse(head) as Stub;
  } catch {
    // ignore errors (handled by separate validate function)
  }

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
