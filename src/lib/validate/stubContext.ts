import type { Stub } from "../../types.ts";

export default (stub: Stub, context: Stub[]): string[] => {
  const errors: string[] = [];

  const parentId = stub.id.split(".").slice(0, -1).join(".");
  if (parentId.length > 0) {
    const parent = context.find((text) => text.id === parentId);
    if (parent === undefined) {
      errors.push(`parent text ${parentId} missing in context (${stub.id})`);
    }
  }

  if (
    Array.isArray(stub.texts) &&
    stub.texts.every((text) => typeof text === "string")
  ) {
    stub.texts.forEach((childId) => {
      const child = context.find((text) => text.id === childId);
      if (child === undefined) {
        errors.push(`child text ${childId} missing in context (${stub.id})`);
      }
    });
  }

  return errors;
};
