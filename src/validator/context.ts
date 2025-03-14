import type { Stub } from "../types.ts";

export default (context: Stub[]): string[] =>
  context.flatMap((stub) => validateStub(stub, context));

const validateStub = (stub: Stub, context: Stub[]): string[] => {
  const errors: string[] = [];

  const parentId = stub.id.split(".").slice(0, -1).join(".");
  if (parentId.length > 0) {
    const parent = context.find((text) => text.id === parentId);
    if (parent === undefined) {
      errors.push(`parent text ${parentId} missing in context (${stub.id})`);
    }
  }

  stub.texts?.forEach((childId) => {
    const child = context.find((text) => text.id === childId);
    if (child === undefined) {
      errors.push(`child text ${childId} missing in context (${stub.id})`);
    }
  });

  return errors;
};
