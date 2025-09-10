export type CompileOptions = {
  contextDirectory: string | null;
  format: Format;
  outputDirectory: string | null;
  emptyOutputDirectory: boolean;
  clearContextCache: boolean;
};

export type ValidateOptions = {
  contextDirectory: string | null;
  logErrors: boolean;
  clearContextCache: boolean;
};

export type Format = "markit" | "text" | "html";

export type Markit<
  TextData extends Record<string, unknown> = Record<string, unknown>,
  ChildrenData extends Record<string, unknown> = TextData,
  BlockData extends Record<string, unknown> = Record<string, unknown>
> = Stub<TextData> & {
  ancestors: Stub<ChildrenData>[];
  children: Stub<ChildrenData>[];
  blocks: Block<BlockData>[];
  previous?: Stub<ChildrenData>;
  next?: Stub<ChildrenData>;
};

export type Stub<
  TextData extends Record<string, unknown> = Record<string, unknown>
> = TextData & {
  id: string;
};

export type Block<
  BlockData extends Record<string, unknown> = Record<string, unknown>
> = BlockData & {
  id: string;
  type: "title" | "paragraph" | "note";
  text: string;
};
