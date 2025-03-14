import { splitContent } from "../compiler/markit.ts"
import validateBlocks from "./markit/blocks.ts";
import validateStub from "./markit/stub.ts";

export default (path: string, content: string): string[] => {
  const { head, body } = splitContent(content);
  const [id, stubErrors] = validateStub(path, head);
  const blockErrors = validateBlocks(id, body);
  return [...stubErrors, ...blockErrors];
};
