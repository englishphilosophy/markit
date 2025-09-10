import validateContent from "./content.ts";

export default (id: string, body: string): string[] =>
  body.length > 0
    ? body.split("\n\n").flatMap((text) => validateBlock(id, text))
    : [];

const validateBlock = (id: string, text: string): string[] => {
  const errors: string[] = [];

  let content = text
    .split("\n")
    .map((line) => line.trim())
    .join(" ");

  const tagRegExp = /^{(.*?)}/;
  const tagCheck = text.match(tagRegExp);
  if (tagCheck) {
    content = content.replace(tagRegExp, "");
    const properties = tagCheck[1].split(",").map((x) => x.trim());
    for (const property of properties) {
      const titleCheck = property.match(/^title$/);
      const idCheck = property.match(/^#(.+?)$/);
      const nameValueCheck = property.match(/^(.+?)=(.+?)$/);
      if (idCheck) {
        id = `${id}.${idCheck[1]}`;
      }
      if (!titleCheck && !idCheck && !nameValueCheck) {
        errors.push(`malformed paragraph property (${id})`);
      }
    }
  }

  return [...errors, ...validateContent(id, content)];
};
