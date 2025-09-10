import type { Format, Markit, Stub } from "../types.ts";
import compileBlocks from "./compile/blocks.ts";
import {
  getAncestors,
  getChildren,
  getNext,
  getPrevious,
} from "./compile/context.ts";
import compileStub from "./compile/stub.ts";

export default (
  content: string,
  context: Stub[] = [],
  format: Format = "markit"
): Markit => {
  const { head, body } = splitContent(content);

  const stub = compileStub(head, context);
  const blocks = compileBlocks(stub.id, body, format);
  const children = getChildren(stub, context);
  const ancestors = getAncestors(stub.id, context);
  const result: Markit = { ...stub, children, blocks, ancestors };

  const previous = getPrevious(stub.id, context);
  const next = getNext(stub.id, context);
  if (previous) result.previous = previous;
  if (next) result.next = next;

  return removeTexts(result);
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

const removeTexts = <Type extends Markit | Stub>(text: Type): Type => {
  delete text.texts;
  if (text.previous) {
    text.previous = removeTexts(text.previous as Stub);
  }
  if (text.next) text.next = removeTexts(text.next as Stub);
  if (Array.isArray(text.ancestors)) {
    text.ancestors = text.ancestors.map(removeTexts);
  }
  if (Array.isArray(text.children)) {
    text.children = text.children.map(removeTexts);
  }
  return text;
};
