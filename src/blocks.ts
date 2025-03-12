import type { Block, Format } from "./types.ts";
import content from "./content.ts";

export default (id: string, body: string, format: Format): Block[] =>
  body.length > 0
    ? body.split("\n\n").map((text) => parseBlock(id, text, format))
    : [];

const parseBlock = (id: string, text: string, format: Format): Block => {
  const block: Block = {
    type: "paragraph",
    content: text
      .split("\n")
      .map((line) => line.trim())
      .join(" "),
  };

  const tagRegExp = /^{(.*?)}(\s+)?/;
  const tagCheck = text.match(tagRegExp);
  if (tagCheck) {
    block.content = block.content.replace(tagRegExp, "");
    const properties = tagCheck[1].split(",").map((x) => x.trim());
    for (const property of properties) {
      const titleCheck = property.match(/^title$/);
      if (titleCheck) {
        block.type = "title";
        block.id = id;
      }

      const idCheck = property.match(/^#(.+?)$/);
      if (idCheck) {
        block.subId = idCheck[1];
        if (block.subId[0] === "n") {
          block.type = "note";
        }
        block.id = `${id}.${idCheck[1]}`;
      }

      const nameValueCheck = property.match(/^(.+?)=(.+?)$/);
      if (nameValueCheck) {
        block[nameValueCheck[1]] = nameValueCheck[2];
      }
    }
  }

  block.content = content(block.content, format);

  return block;
};
