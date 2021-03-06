export type Rules = { [T in Tag]: string[] }
  
export type Tag =
  | '~~'
  | '~'
  | '//'
  | '|'
  | '£1'
  | '£2'
  | '£3'
  | '£4'
  | '£5'
  | '£6'
  | '""'
  | '"'
  | '*'
  | '_'
  | '^'
  | '='
  | '$'
  | '#'
  | '{++text++}'
  | '{--text--}'
  | '{~~text1->text2~~}'
  | '[nX]'
  | '[text1](text2)'
  | '[text]'

export const html: Rules = {
  '~~': ['&emsp;'],
  '~': ['&nbsp;'],
  '//': ['<br>'],
  '|': ['<span class="page-break"></span>'],
  '£1': ['<h1>', '</h1> '],
  '£2': ['<h2>', '</h2> '],
  '£3': ['<h3>', '</h3> '],
  '£4': ['<h4>', '</h4> '],
  '£5': ['<h5>', '</h5> '],
  '£6': ['<h6>', '</h6> '],
  '""': ['<blockquote>', '</blockquote>'],
  '"': ['<q>', '</q>'],
  '*': ['<strong>', '</strong>'],
  '_': ['<em>', '</em>'],
  '^': ['<span class="small-capitals">', '</span>'],
  '=': ['<span class="name">', '</span>'],
  '$': ['<span class="foreign">', '</span>'],
  '#': ['<span class="margin-comment">', '</span>'],
  '{++text++}': ['<ins>{text}</ins>'],
  '{--text--}': ['<del>{text}</del>'],
  '{~~text1->text2~~}': ['<del>{text1}</del><ins>{text2}</ins>'],
  '[nX]': ['<a href="#n{X}"><sup>[{X}]</sup></a>'],
  '[text1](text2)': ['<a href="{text2}">{text1}</a>'],
  '[text]': ['<cite>{text}</cite>']
}

export const tei: Rules = {
  '~~': ['&emsp;'],
  '~': ['&nbsp;'],
  '//': ['<br />'],
  '|': ['<pb />'],
  '£1': ['<title rend="h1">', '</title> '],
  '£2': ['<title rend="h2">', '</title> '],
  '£3': ['<title rend="h3">', '</title> '],
  '£4': ['<title rend="h4">', '</title> '],
  '£5': ['<title rend="h5">', '</title> '],
  '£6': ['<title rend="h6">', '</title> '],
  '""': ['<q rend="block">', '</q>'],
  '"': ['<q>', '</q>'],
  '*': ['<hi rend="bold">', '</hi>'],
  '_': ['<hi rend="italic">', '</hi>'],
  '^': ['<hi rend="small-capitals">', '</hi>'],
  '=': ['<name>', '</name>'],
  '$': ['<foreign>', '</foreign>'],
  '#': ['<note type="margin">', '</note>'],
  '{++text++}': ['<add>{text}</add>'],
  '{--text--}': ['<del>{text}</del>'],
  '{~~text1->text2~~}': ['<del>{text1}</del><add>{text2}</add>'],
  '[nX]': ['<note ref="#n{X}" />'],
  '[text1](text2)': ['<ref target="{text2}">${text1}</ref>'],
  '[text]': ['<ref>{text}</ref>']
}

export const txt: Rules = {
  '£1': ['', '\n'],
  '£2': ['', '\n'],
  '£3': ['', '\n'],
  '£4': ['', '\n'],
  '£5': ['', '\n'],
  '£6': ['', '\n'],
  '~~': ['  '],
  '~': [' '],
  '//': ['\n'],
  '|': [''],
  '""': ['\n\n', '\n\n'],
  '"': ['"', '"'],
  '*': ['', ''],
  '_': ['', ''],
  '^': ['', ''],
  '=': ['', ''],
  '$': ['', ''],
  '#': ['{', '}'],
  '{++text++}': ['{text}'],
  '{--text--}': [''],
  '{~~text1->text2~~}': ['{text2}'],
  '[nX]': ['[n{X}]'],
  '[text1](text2)': ['[{text1}]'],
  '[text]': ['[{text}]']
}
