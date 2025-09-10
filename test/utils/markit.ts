export type ContentOptions = {
  id?: string;
  metadata?: Record<string, string>;
  texts?: string[];
  lines?: string[];
  blocks?: string[];
};

export const createContent = ({
  id,
  metadata,
  lines,
  blocks,
  texts,
}: ContentOptions) =>
  [
    "---",
    ...(id ? [`id: ${id}`] : []),
    ...(metadata
      ? Object.entries(metadata).map(([key, value]) => `${key}: ${value}`)
      : []),
    ...(texts ? ["texts:", ...texts.map((text) => `  - ${text}`)] : []),
    "---",
    ...(blocks ? blocks.flatMap((block) => [block, ""]) : []),
    ...(lines ?? []),
  ].join("\n");
