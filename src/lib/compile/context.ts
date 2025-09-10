import type { Stub } from "../../types.ts";

export const getParent = (id: string, context: Stub[]): Stub | undefined => {
  const parentId = id.split(".").slice(0, -1).join(".");
  return context.find((text) => text.id === parentId);
};

export const getPrevious = (id: string, context: Stub[]): Stub | undefined => {
  const parent = getParent(id, context);

  if (parent !== undefined) {
    const siblings = getChildren(parent, context);
    const index = siblings.findIndex((stub) => stub.id === id);
    return index === 0 ? parent : siblings[index - 1];
  }

  return undefined;
};

export const getNext = (id: string, context: Stub[]): Stub | undefined => {
  const self = context.find((stub) => stub.id === id);
  if (
    self !== undefined &&
    self.texts !== undefined &&
    Array.isArray(self.texts) &&
    self.texts.every((text) => typeof text === "string")
  ) {
    const firstChildId = self.texts[0];
    const firstChild = context.find((stub) => stub.id === firstChildId);
    if (firstChild) return firstChild;
  }

  const parent = getParent(id, context);

  if (parent !== undefined) {
    const siblings = getChildren(parent, context);
    const index = siblings.findIndex((stub) => stub.id === id);
    return index === siblings.length
      ? getNext(parent.id, context)
      : siblings[index + 1];
  }

  return undefined;
};

export const getChildren = (stub: Stub, context: Stub[]): Stub[] =>
  Array.isArray(stub.texts) &&
  stub.texts.every((text) => typeof text === "string")
    ? stub.texts.map((id) => {
        const stub = context.find((stub) => stub.id === id);
        return stub ? stub : { id };
      })
    : [];

export const getAncestors = (id: string, context: Stub[]): Stub[] => {
  const parent = getParent(id, context);
  return parent ? [...getAncestors(parent.id, context), parent] : [];
};
