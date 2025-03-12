import type { Stub } from "./types.ts";

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
  stub.texts
    ? stub.texts.map((id) => context.find((stub) => stub.id === id) ?? { id })
    : [];
