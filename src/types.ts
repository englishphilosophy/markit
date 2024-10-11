export type Markit = MetaData & { blocks: Block[] };

export type MetaData = Record<string, unknown> & { id?: string };

export type Block = Record<string, string> & {
  type: "title" | "paragraph" | "note";
  content: string;
};
