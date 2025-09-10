import type { Stub } from "../types.ts";
import { splitContent } from "./compile.ts";
import validateBlocks from "./validate/blocks.ts";
import validateStub from "./validate/stub.ts";
import validateStubContext from "./validate/stubContext.ts";

export const validateContext = (context: Stub[]): string[] =>
  context.flatMap((stub) => validateStubContext(stub, context));

export const validateMarkit = (path: string, content: string): string[] => {
  const { head, body } = splitContent(content);
  const [id, stubErrors] = validateStub(path, head);
  const blockErrors = validateBlocks(id, body);
  return [...stubErrors, ...blockErrors];
};
