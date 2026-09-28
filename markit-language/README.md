# Markit Language Support

Editor support for [Markit](https://github.com/earlytexts/markit), a markup language for preserving early texts — a human-readable alternative to TEI-XML, designed for transcribing hand-press books.

Open any `.mit` file and this extension gives you colouring, live error checking, folding, formatting, and a preview of the rendered text beside your source.

## Features

### Syntax highlighting

Structure is coloured — text IDs, block tags, metadata blocks and their values, heading lines, block quotations — and so is every inline construct: emphasis, small caps, quotation, superscript and subscript, speakers and stage directions, marginal asides, persons, places, organisations, citations, foreign runs, word disambiguation, the editorial marks (insertion, deletion, uncertain, illegible), page breaks, footnote references, spacing markers and escapes, and both transliteration modes.

Colour decorators are turned off inside `.mit` files, so a word like `red` in your text is not mistaken for a colour swatch.

### Live error reporting

The document is compiled as you type — debounced by a fifth of a second, so a large text stays responsive — and problems are underlined where they occur. Everything from a duplicate block ID or a footnote reference with no note, to an unclosed italic, a heading in the wrong kind of block, or a malformed `[w:…]` element. Full list in the [specification](https://github.com/earlytexts/markit/blob/main/SPECIFICATION.md#53-diagnostics).

Markit is error-tolerant, so nothing here stops you working: the file still compiles and the preview still renders while you fix it.

### Live preview

`Cmd+Shift+V` (macOS) or `Ctrl+Shift+V` (Windows/Linux) opens a rendered preview beside your file, and it follows you as you type. There is also a preview button in the editor title bar.

Because the preview renders exactly what the compiler produces, it is the fastest way to check a title page's relative sizes, a stretch of transliterated Greek, or whether an emphasis marker is closed where you think it is.

### Formatting

`Alt+Shift+F` (or Format Document, or format-on-save) tidies the whole file: blank lines normalised, block tags and metadata put into canonical form, paragraphs collapsed onto one line, table columns aligned, ordered lists renumbered, nested list indents snapped to two spaces.

It also **resolves character modes**: type `{e/}` and the formatter writes `é`, `{ae}` becomes `æ`, `{--}` becomes `—`. The braces are an input method for characters that are not on your keyboard; the formatter cashes them in.

It never rewraps your prose and never changes a word of the text.

### Folding

Fold a whole text or sub-text, its metadata block, or any individual content block — folding ranges come from the compiled document, not from indentation, so they always match the real structure.

### Snippets and auto-closing pairs

Type a prefix and press Tab:

| Prefix     | Inserts                                 |
| ---------- | --------------------------------------- |
| `section`  | A text with an ID, a block, and content |
| `sub`      | A level-2 sub-text                      |
| `para`     | A paragraph block                       |
| `title`    | A title block                           |
| `footnote` | A footnote block                        |
| `fnref`    | An inline footnote reference            |
| `meta`     | A metadata key–value pair               |
| `strong`   | `*small caps*`                          |
| `em`       | `_emphasis_`                            |
| `quote`    | `"quotation"`                           |
| `cite`     | `[citation]`                            |

Paired markers close themselves as you type — `_`, `*`, `^`, `,,`, `@`, `::`, `$`, `"`, and the bracket forms `[+ +]`, `[- -]`, `[? ?]` — and selecting text then typing a marker wraps the selection instead of replacing it.

## Commands

Open the command palette (`Cmd/Ctrl+Shift+P`) and type "Markit":

| Command                          | Shortcut                | Result                                       |
| -------------------------------- | ----------------------- | -------------------------------------------- |
| Markit: Open Preview to the Side | `Cmd`/`Ctrl` `+Shift+V` | Rendered preview beside the editor           |
| Markit: Compile to HTML          | —                       | Writes `<name>.html` next to your file       |
| Markit: Compile to JSON          | —                       | Writes `<name>.json` — the compiled document |
| Markit: Compile to Text          | —                       | Writes `<name>.txt` — the plain reading text |
| Format Document                  | `Alt+Shift+F`           | Canonical formatting                         |

The compile commands save the file first, and tell you afterwards if the compile logged any errors.

## Getting started

1. Install the extension.
2. Create a file with a `.mit` extension.
3. Type `section` and press Tab for a skeleton document.
4. Press `Cmd/Ctrl+Shift+V` to watch it render.

If you have not written Markit before, [Writing Markit](https://github.com/earlytexts/markit/blob/main/GUIDE.md) is a tutorial that starts from nothing and works through a real transcription.

If you are contributing to the Early Text Centre corpus, install the [Compositor](https://github.com/earlytexts/corpus) as well: it adds corpus-specific tooling — finding a text, checking spellings against the register, submitting your work — on top of the language support here.

## Requirements

VS Code 1.85 or later. Nothing else — the compiler is bundled with the extension.

## Documentation

- [Writing Markit](https://github.com/earlytexts/markit/blob/main/GUIDE.md) — the tutorial
- [Specification](https://github.com/earlytexts/markit/blob/main/SPECIFICATION.md) — every construct, exactly stated
- [Element index](https://github.com/earlytexts/markit/blob/main/SPECIFICATION.md#5-element-index) — one page of every marker

## Licence

MIT — see [LICENSE.md](./LICENSE.md).
