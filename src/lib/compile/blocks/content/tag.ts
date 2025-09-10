import type { DoubleTag, Rules } from "./rules.ts";

export const open = (tag: DoubleTag, rules: Rules) => rules[tag][0];

export const close = (tag: DoubleTag, rules: Rules) => rules[tag][1];

export const insertion = (text: string, rules: Rules) =>
  rules["{++text++}"].replace(/{text}/g, text);

export const deletion = (text: string, rules: Rules) =>
  rules["{--text--}"].replace(/{text}/g, text);

export const replacement = (text1: string, text2: string, rules: Rules) =>
  rules["{~~text1->text2~~}"]
    .replace(/{text1}/g, text1)
    .replace(/{text2}/g, text2);

export const footnote = (id: string, rules: Rules) =>
  rules["[nX]"].replace(/{X}/g, id);

export const link = (text1: string, text2: string, rules: Rules) =>
  rules["[text1](text2)"].replace(/{text1}/g, text1).replace(/{text2}/g, text2);

export const citation = (text: string, rules: Rules) =>
  rules["[text]"].replace(/{text}/g, text);
