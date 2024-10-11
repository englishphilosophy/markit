import { parse as parseYaml } from "@std/yaml";
import type { Block, Markit, MetaData } from "./types.ts";

export default (input: string): Markit => {
  const yamlRegExp = /^---\n((.|\n)*?)\n---\n?/;
  const yamlCheck = input.match(yamlRegExp);
  const head = yamlCheck ? yamlCheck[1] : "";
  const body = (yamlCheck ? input.replace(yamlRegExp, "") : input).trim();

  const metadata = (parseYaml(head) ?? {}) as MetaData;
  if (metadata.id !== undefined && typeof metadata.id !== "string") {
    metadata.id = JSON.stringify(metadata.id);
  }

  const blocks =
    body.length > 0
      ? body.split("\n\n").map((text) => parseBlock(metadata, text))
      : [];

  return { ...metadata, blocks };
};

const parseBlock = (metadata: MetaData, text: string): Block => {
  const content = text
    .split("\n")
    .map((line) => line.trim())
    .join(" ");
  const block: Block = { type: "paragraph", content };

  const tagRegExp = /^{(.*?)}\s+/;
  const tagCheck = text.match(tagRegExp);
  if (tagCheck) {
    block.content = block.content.replace(tagRegExp, "");
    const properties = tagCheck[1].split(",").map((x) => x.trim());
    for (const property of properties) {
      const titleCheck = property.match(/^title$/);
      if (titleCheck) {
        block.type = "title";
        if (metadata.id) {
          block.id = metadata.id;
        }
      }

      const idCheck = property.match(/^#(.*?)$/);
      if (idCheck) {
        block.subId = idCheck[1];
        if (block.subId[0] === "n") {
          block.type = "note";
        }
        block.id = metadata.id ? `${metadata.id}.${idCheck[1]}` : idCheck[1];
      }

      const nameValueCheck = property.match(/^(.*?)=(.*?)$/);
      if (nameValueCheck) {
        block[nameValueCheck[1]] = nameValueCheck[2];
      }
    }
  }

  return block;
};
