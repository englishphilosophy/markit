export type Format = "txt" | "html";

export type Markit = Omit<Stub, "texts"> & {
  previous?: Stub;
  next?: Stub;
  texts: Stub[];
  blocks: Block[];
};

export type Stub = Record<string, unknown> & {
  id: string;
  texts?: string[];
};

export type Block = Record<string, string> & {
  type: "title" | "paragraph" | "note";
  content: string;
};
