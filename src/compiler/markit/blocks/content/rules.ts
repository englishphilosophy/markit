export type Tag = SimpleTag | DoubleTag | ComplexTag;

export type SimpleTag = "~~" | "~" | "//" | "|";

export type DoubleTag =
  | "£1"
  | "£2"
  | "£3"
  | "£4"
  | "£5"
  | "£6"
  | '""'
  | '"'
  | "*"
  | "_"
  | "^"
  | "="
  | "$"
  | "#";

export type ComplexTag =
  | "{++text++}"
  | "{--text--}"
  | "{~~text1->text2~~}"
  | "[nX]"
  | "[text1](text2)"
  | "[text]";

export type Rules = Record<SimpleTag, string> &
  Record<DoubleTag, [string, string]> &
  Record<ComplexTag, string>;

export const html: Rules = {
  "~~": "&emsp;",
  "~": "&nbsp;",
  "//": "<br />",
  "|": '<span class="page-break"></span>',
  "£1": ["</p><h1>", "</h1><p>"],
  "£2": ["</p><h2>", "</h2><p>"],
  "£3": ["</p><h3>", "</h3><p>"],
  "£4": ["</p><h4>", "</h4><p>"],
  "£5": ["</p><h5>", "</h5><p>"],
  "£6": ["</p><h6>", "</h6><p>"],
  '""': ["</p><blockquote>", "</blockquote><p>"],
  '"': ["<q>", "</q>"],
  "*": ["<strong>", "</strong>"],
  _: ["<em>", "</em>"],
  "^": ['<span class="small-capitals">', "</span>"],
  "=": ['<span class="name">', "</span>"],
  $: ['<span class="foreign">', "</span>"],
  "#": ['<span class="margin-comment">', "</span>"],
  "{++text++}": "<ins>{text}</ins>",
  "{--text--}": "<del>{text}</del>",
  "{~~text1->text2~~}": "<del>{text1}</del><ins>{text2}</ins>",
  "[nX]": '<a href="#n{X}"><sup>[{X}]</sup></a>',
  "[text1](text2)": '<a href="{text2}">{text1}</a>',
  "[text]": "<cite>{text}</cite>",
};

export const txt: Rules = {
  "~~": "  ",
  "~": " ",
  "//": "\n",
  "|": "",
  "£1": ["", "\n"],
  "£2": ["", "\n"],
  "£3": ["", "\n"],
  "£4": ["", "\n"],
  "£5": ["", "\n"],
  "£6": ["", "\n"],
  '""': ["\n\n", "\n\n"],
  '"': ['"', '"'],
  "*": ["", ""],
  _: ["", ""],
  "^": ["", ""],
  "=": ["", ""],
  $: ["", ""],
  "#": ["{", "}"],
  "{++text++}": "{text}",
  "{--text--}": "",
  "{~~text1->text2~~}": "{text2}",
  "[nX]": "[n{X}]",
  "[text1](text2)": "[{text1}]",
  "[text]": "[{text}]",
};
