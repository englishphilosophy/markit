export type Options = {
  format: 'html'|'json'|'tei'|'txt'
  extension: 'html'|'json'|'xml'|'txt'
  textFormat: 'path'|'stub'|'full'
  textStubProperties: string[]
  maximumDepth: number
  contentFormat: 'html'|'mit'|'tei'|'txt'
  rules: Rules
  createLogFile: boolean
}

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
