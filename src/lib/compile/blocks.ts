import type { Block, Format } from "../../types.ts";
import compileContent from "./blocks/content.ts";

export default (id: string, body: string, format: Format): Block[] =>
  body.length > 0
    ? body
        .split("\n\n")
        .map((text, index) => parseBlock(id, index, text, format))
    : [];

const parseBlock = (
  parentId: string,
  index: number,
  text: string,
  format: Format
): Block => {
  const block: Block = {
    id: `${parentId}.${index}`,
    type: "paragraph",
    text: text
      .split("\n")
      .map((line) => line.trim())
      .join(" "),
  };

  const tagRegExp = /^{(.*?)}(\s+)?/;
  const tagCheck = text.match(tagRegExp);
  if (tagCheck) {
    block.text = block.text.replace(tagRegExp, "");
    const properties = tagCheck[1].split(",").map((x) => x.trim());
    for (const property of properties) {
      const titleCheck = property.match(/^title$/);
      if (titleCheck) {
        block.type = "title";
        block.id = parentId;
      }

      const idCheck = property.match(/^#(.+?)$/);
      if (idCheck) {
        if (idCheck[1][0] === "n") {
          block.type = "note";
        }
        block.id = `${parentId}.${idCheck[1]}`;
      }

      const nameValueCheck = property.match(/^(.+?)=(.+?)$/);
      if (nameValueCheck) {
        block[nameValueCheck[1]] = nameValueCheck[2];
      }
    }
  }

  block.text =
    format === "markit" ? block.text : compileContent(block.text, format);

  return block;
};
