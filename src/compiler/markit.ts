import type { Format, Markit, Stub } from "../types.ts";
import compileBlocks from "./markit/blocks.ts";
import { getChildren, getNext, getPrevious } from "./markit/context.ts";
import compileStub from "./markit/stub.ts";

export default (
  content: string,
  format: Format,
  context: Stub[] = []
): Markit => {
  const { head, body } = splitContent(content);
  const stub = compileStub(head, context);
  const previous = getPrevious(stub.id, context);
  const next = getNext(stub.id, context);
  const texts = getChildren(stub, context);
  const blocks = compileBlocks(stub.id, body, format);
  const result: Markit = { ...stub, texts, blocks };
  if (previous) result.previous = previous;
  if (next) result.next = next;
  return result;
};

export const compileBaseStub = (content: string): Stub => {
  const { head } = splitContent(content);
  return compileStub(head, []);
};

export const splitContent = (content: string) => {
  const yamlRegExp = /^---\n((.|\n)*?)\n---\n?/;
  const yamlCheck = content.match(yamlRegExp);
  const head = yamlCheck ? yamlCheck[1] : "";
  const body = (yamlCheck ? content.replace(yamlRegExp, "") : content).trim();
  return { head, body };
};
