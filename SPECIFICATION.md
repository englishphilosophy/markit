# Markit: Language Specification

Markit is a markup language for textual preservation. Files use the `.mit` extension. The compiler is error-tolerant: it always produces JSON output and accumulates diagnostics separately.

This document is normative: it states what is legal and what each construct compiles to. It is not a tutorial — for that, see the [guide](./GUIDE.md). For the compiler's programmatic surface, see the [API reference](./API.md). §5 is a one-page index of every marker in the language.

## 1. Document Structure

### 1.1. Texts and IDs

A Markit document is a tree of _texts_. Each text begins with one or more `#` characters followed by a unique ID. Depth is indicated by the number of `#` characters. IDs are case-sensitive, must not contain whitespace or `#`, and must be unique among siblings.

```
# Title

...

## Chapter1

...

### Section1

..

## Chapter2

...
```

In the compiled output, parent IDs are prepended with `.` (e.g. `Title.Chapter1.Section2`).

### 1.2. Text Metadata

Text IDs can optionally be followed by a _metadata block_, starting with `[metadata]` and containing TOML-style `key = value` pairs. Supported value types: Boolean, number, string, and homogeneous arrays of these. You can create nested objects one level deep with subsequent `[metadata.<key>]` blocks.

```
# Title

[metadata]
reviewed = true
year = 1721
title = "A Treatise of Human Nature"
tags = ["philosophy"]

[metadata.links]
wikipedia = "https://en.wikipedia.org/wiki/..."
googleBooks = "https://books.google.com/..."
```

Unlike TEI-XML, Markit does not have a fixed set of metadata fields. You can use any keys you like, and the compiler will preserve them in the output JSON.

### 1.3. Content Blocks

Following the metadata (if any), each text contains zero or more _content blocks_. A content block starts with a _block tag_: `{#id}`. Block IDs cannot contain whitespace, `#`, `{`, or `}`.

There are four _types_ of content block, determined by the block ID:

| ID pattern    | Type        | Rules                                                                 |
| ------------- | ----------- | --------------------------------------------------------------------- |
| `title`       | `title`     | At most one per text; must be the first block                         |
| `subtitle`    | `subtitle`  | Any number; anywhere; output IDs become `Text.subtitle1`, `subtitle2` |
| `n` + chars   | `footnote`  | Must appear after all paragraph blocks; referenced via `<nID>`        |
| anything else | `paragraph` |                                                                       |

Block tags can optionally include _block metadata_: comma-separated `key=value` pairs after the ID. These follow the same rules as text metadata, except that nested objects are not supported. For example:

```
{#1, speaker="Philo", modified=true}
```

## 2. Block-Level Elements

Inside a block, content is parsed into block-level elements. A blank line is required to separate two elements of the same type; otherwise elements of different types end automatically at the start of the next one.

### 2.1. Headings

Lines starting with `^` followed by a number from 1 to 6 indicate headings of different levels. Headings are only permitted in `title` and `subtitle` blocks. The number after the caret indicates the display size (1 being the largest, 6 being the smallest).

```
^3 A
^1 TREATISE
^4 OF
^2 Human Nature
```

### 2.2. Stage Directions

Lines starting with `:` indicate stage directions. Consecutive lines collapse into a single paragraph inside the stage direction; for multiple paragraphs, leave a blank line starting with `:`.

```markit
: This is a stage direction.
:
: Second paragraph inside the stage direction.
```

A stage direction may contain any block-level element except a heading. Strip one `:` (and an optional single space) from each line, and the remainder is parsed as ordinary block content — so a stage direction can hold lists, verse, tables, and nested block quotations or stage directions, not just paragraphs (see §2.3 for an example).

### 2.3. Block Quotations

Lines starting with `>` indicate block quotations. Consecutive lines collapse into a single paragraph inside the block quotation; for multiple paragraphs, leave a blank line starting with `>`.

```markit
> This is a block quote.
>
> Second paragraph inside the quote.
```

A block quotation may contain any block-level element except a heading. Each line has one `>` (and an optional single space) stripped, and the remainder is parsed as ordinary block content. So a quotation can hold lists, verse, tables, and nested quotations or stage directions. Nesting a quotation uses a doubled marker (`>>`), and a heading inside a quotation is a syntax error.

```markit
> As the argument runs:
>
> - first the premise,
> - then the inference.
>
> * And a snatch of quoted verse
> * closes the passage.
```

### 2.4. Lists

Markit supports both ordered and unordered lists, with nesting to arbitrary depth. Unordered list items start with `-`, ordered list items start with a number followed by a period (e.g. `1.`). Nested lists use 2-space indent. Ordered lists can start at any number; subsequent items always increment by 1.

```markit
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

3. Item starting at 3
4. Item 4
```

### 2.5. Verse

Lines of verse start with `*`. A blank line separates stanzas (each stanza is a separate block).

```markit
* Fear no more the heat o' the sun,
* Nor the furious winter's rages;
* Thou thy worldly task hast done,
* Home art gone, and ta'en thy wages.

* Golden lads and girls all must,
* As chimney-sweepers, come to dust.
```

### 2.6. Tables

Tables are defined by rows of pipe-separated cells, with an optional header row. The first row determines the number of columns. For example:

```markit
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

Without separator row, the table is rendered without a header.

### 2.7. Paragraphs

If a line does not match any of the above patterns, it is treated as a paragraph. Consecutive lines form one paragraph.

```markit
This is a paragraph.
This is the same paragraph, because there is no blank line in between.

This is a new paragraph, because of the blank line.
```

## 3. Inline Elements

### 3.1. Types and Syntax

Block-level elements can contain a mixture of plan text and inline elements. Inline elements are marked with special syntax, for example `*strong*` for strong text, `_emphasis_` for emphasis, `"quote"` for inline quotations, etc. The full list of inline element types and their syntax is as follows:

| Syntax              | Type                | Notes                                                |
| ------------------- | ------------------- | ---------------------------------------------------- |
| `"text"`            | `quote`             | Inline quotation                                     |
| `*text*`            | `strong`            | Small-caps                                           |
| `_text_`            | `emphasis`          | Italics                                              |
| `^text^`            | `superscript`       | Superscript                                          |
| `,,text,,`          | `subscript`         | Subscript                                            |
| `@text@`            | `speaker`           | Speaker name in dialogue                             |
| `::text::`          | `stageDirection`    | Stage direction in dialogue                          |
| `#text#`            | `aside`             | Margin comment                                       |
| `<nID>`             | `footnoteReference` | Must match a `footnote` block in same text           |
| `~`                 | `nbSpace`           | Non-breaking space                                   |
| `~~`                | `tab`               | Tab                                                  |
| `\`                 | `lineBreak`         | Line break; only before a space or end of line       |
| `///`               | `pageBreak`         | No page reference                                    |
| `//ref//`           | `pageBreak`         | `ref` is any non-whitespace string                   |
| `[+text+]`          | `insertion`         | Editorial insertion                                  |
| `[-text-]`          | `deletion`          | Editorial deletion                                   |
| `[?text?]`          | `uncertain`         | Illegible or uncertain text                          |
| `[...]`             | `illegible`         | Completely illegible text                            |
| `$text$`            | `language`          | Generic foreign text; no `lang` in output            |
| `$xx:text$`         | `language`          | `lang` set to ISO 639 code (`la`, `fr`, `grc`, etc.) |
| `[text]`            | `citation`          | Cited work                                           |
| `[p:text]`          | `person`            | Person name                                          |
| `[l:text]`          | `place`             | Place name                                           |
| `[o:text]`          | `org`               | Organization name                                    |
| `[w:surface=word]`  | `word`              | Disambiguated form (see §3.5)                        |
| `<<tag…>>…<</tag>>` | `element`           | Generic/raw element (escape hatch); see §3.4         |

Wrappers may nest, and their content is itself parsed as inline content. An empty wrapper (`**`, `""`) and an unclosed one are both diagnostics; in each case the delimiters are left as literal text. Which marker is tried first where two could match is fixed — see §5.2.

A page break is **tight** when a non-whitespace character abuts it on both sides in the source (`be///ginning`), and **loose** otherwise. The distinction is recorded in the output (`tight: true`) and is semantic, not cosmetic: a tight break falls inside a word, so it renders and extracts to nothing and the word either side is joined into one token; a loose break is a word boundary and contributes a single space.

### 3.2. Whitespace

In inline content, multiple spaces collapse to one space, and multiple blank lines collapse to one blank line. Single line breaks within a block are treated as spaces.

You can use the `~` (non-breaking space), `~~` (em space / tab), and `\` (line break) markers to preserve spacing/breaks explicitly.

### 3.3. Escape Sequences and Line Breaks

A backslash has two meanings, decided by the character after it:

- Followed by a space or the end of the line, it is a **hard line break** (`lineBreak`). The formatter writes this form canonically as ` \` at the end of a line, with the following text starting the next line.
- Followed by anything else, it **escapes** that character, which is then taken literally: `\*`, `\{`, `\[`. A literal backslash is therefore `\\` (an escaped backslash), not a line break.

Both meanings apply everywhere in inline content, including inside wrappers. Inside a transliteration mode (§4) the escape still works, but over a different set of special characters (§4.3).

### 3.4. Generic Elements

Markit's inline vocabulary is deliberately small. For markup that has no native equivalent — chiefly when importing from richer formats such as TEI/TCP XML — a generic _element_ provides a lossless escape hatch. Its syntax mirrors XML, but with doubled angle brackets so it never collides with footnote references (`<nID>`):

```
<<TAG attr="value">>content<</TAG>>
<<TAG attr="value"/>>
```

The first form wraps further inline content (which may itself contain native elements or nested generic elements); the second is self-closing/empty. The tag name and ordered attributes are preserved verbatim, so a foreign element survives a round trip unchanged. Attribute values are read literally between double quotes and therefore cannot contain a `"` (encode it as `&quot;`). A `<<` that does not open a well-formed start tag is treated as literal text.

This element carries no inherent display semantics; renderers fall back to emitting its content. It is intended for machine-generated documents (e.g. the output of `fromTEIXML`) and the long tail of preserved markup, not for everyday authoring.

### 3.5. Word Disambiguation

Early modern spelling is often ambiguous: a single printed form can stand for what are, to a modern reader, two different words. A word element records both — the surface form exactly as printed, and the intended (disambiguated) word — without altering the text a reader sees:

```markit
but of very little use in [w:humane=human] Life
```

The surface (`humane`, before the `=`) is what renders; the disambiguated word (`human`, after the `=`) is preserved in the compiled output for search and indexing but is never displayed. The surface is parsed as ordinary inline content, so transliteration modes and other inline markup work inside it (`[w:{oe}conomy=economy]`); the disambiguated word is a plain string.

Because `=` separates the two parts and `]` closes the element, both are structural inside `[w:…]`. To use either literally, escape it: `[w:a\=b=equals]` gives the surface `a=b`. A `[w:…]` with no `=` before its closing `]`, or with no closing `]` at all, is a malformed word element: the compiler reports a diagnostic and leaves the text literal.

A word element assigns a disambiguated word to one token, so the surface must be exactly **one** word token; a surface with more tokens (`[w:two words=x]`) or none is a compile error. A multi-word unit is marked with non-breaking spaces first, which makes it one token: `[w:a~priori=a priori]` is legal.

## 4. Transliteration Modes

### 4.1. Character Mode `{...}`

You can wrap plain text in curly braces `{...}` to apply character-level transformations, such as digraphs and diacritics. This is useful for inputting accented and other special characters not easily typed on a keyboard.

Transliteration modes are an input method, not document structure: the compiled output holds the final Unicode characters, and the braced and literal spellings compile to the identical document. The formatter canonicalises the source accordingly, rewriting each braced span to the characters it compiles to (type `{e/}`, save, the formatter writes `é`). A span is left braced only when rewriting it could change how the source re-parses (e.g. an escape like `{\$}` whose output is a Markit syntax character).

**Digraphs** (matched first):

| Input | Output | Input | Output |
| ----- | ------ | ----- | ------ |
| `ae`  | `æ`    | `AE`  | `Æ`    |
| `oe`  | `œ`    | `OE`  | `Œ`    |
| `c,`  | `ç`    | `C,`  | `Ç`    |

**Diacritics** (written after base character):

| Marker  | Diacritic  | Example  | Output |
| ------- | ---------- | -------- | ------ |
| `/`     | acute      | `{e/}`   | `é`    |
| `` ` `` | grave      | ``{a`}`` | `à`    |
| `^`     | circumflex | `{a^}`   | `â`    |
| `"`     | diaeresis  | `{a"}`   | `ä`    |

**Special symbols**:

| Marker | Output        |
| ------ | ------------- |
| `$`    | `§` (section) |
| `-`    | `–` (en-dash) |
| `--`   | `—` (em-dash) |

### 4.2. Greek Mode `{{...}}`

You can wrap plain text in double curly braces `{{...}}` to apply Latin-to-Greek transliteration on top of diacritics. This is intended for inputting Ancient Greek text without needing a Greek keyboard.

**Transliteration digraphs** (matched before single characters):

| Latin input | Greek output |
| ----------- | ------------ |
| `th`        | `θ`          |
| `Th` / `TH` | `Θ`          |
| `ph`        | `φ`          |
| `Ph` / `PH` | `Φ`          |
| `ch`        | `χ`          |
| `Ch` / `CH` | `Χ`          |
| `ps`        | `ψ`          |
| `Ps` / `PS` | `Ψ`          |

**Single character transliteration:**

| Latin | Greek | Latin | Greek |
| ----- | ----- | ----- | ----- |
| `a`   | `α`   | `A`   | `Α`   |
| `b`   | `β`   | `B`   | `Β`   |
| `g`   | `γ`   | `G`   | `Γ`   |
| `d`   | `δ`   | `D`   | `Δ`   |
| `e`   | `ε`   | `E`   | `Ε`   |
| `z`   | `ζ`   | `Z`   | `Ζ`   |
| `h`   | `η`   | `H`   | `Η`   |
| `i`   | `ι`   | `I`   | `Ι`   |
| `k`   | `κ`   | `K`   | `Κ`   |
| `l`   | `λ`   | `L`   | `Λ`   |
| `m`   | `μ`   | `M`   | `Μ`   |
| `n`   | `ν`   | `N`   | `Ν`   |
| `x`   | `ξ`   | `X`   | `Ξ`   |
| `o`   | `ο`   | `O`   | `Ο`   |
| `p`   | `π`   | `P`   | `Π`   |
| `r`   | `ρ`   | `R`   | `Ρ`   |
| `s`   | `σ`   | `S`   | `Σ`   |
| `t`   | `τ`   | `T`   | `Τ`   |
| `u`   | `υ`   | `U`   | `Υ`   |
| `y`   | `υ`   | `Y`   | `Υ`   |
| `w`   | `ω`   | `W`   | `Ω`   |

A lowercase `s` immediately followed by a word boundary (whitespace, punctuation, or end of content) is rendered as final sigma `ς` instead of `σ`. Diacritic markers are not word boundaries. Any character not listed above passes through unchanged.

**Greek diacritic markers** (written immediately after the base character):

| Marker  | Diacritic                |
| ------- | ------------------------ |
| `)`     | smooth breathing (psili) |
| `(`     | rough breathing (dasia)  |
| `/`     | acute accent             |
| `` ` `` | grave accent             |
| `^`     | circumflex (perispomeni) |
| `"`     | diaeresis                |
| `\|`    | iota subscript           |

When multiple markers follow one character, write them in canonical order: breathing → accent → diaeresis/iota-subscript (e.g. `a)/` for ἄ). Writing markers in the wrong order produces incorrect output without an error.

### 4.3. General Notes on Transliteration Modes

Transliteration is applied before any other parsing, including parsing of inline elements. This means that you cannot use inline element syntax (`*`, `_`, etc.) inside a transliteration block, because it will be treated as literal characters and not parsed as inline elements.

You can escape special characters inside transliteration blocks with `\` as usual, but note that the set of special characters is different. For example, `*` and `_` are not special characters; `^` is a special character; `"` is also a special character, but has a different meaning (diaeresis instead of quotation).

## 5. Element Index

Every marker in the language on one page.

### 5.1. Markers

**Structure** — each of these must begin a line.

| Marker             | Meaning                                   | §    |
| ------------------ | ----------------------------------------- | ---- |
| `# id`             | Text (root); `##`, `###`, … for sub-texts | §1.1 |
| `[metadata]`       | Text metadata block (TOML-style pairs)    | §1.2 |
| `[metadata.<key>]` | Nested metadata table (one level deep)    | §1.2 |
| `{#id}`            | Content block                             | §1.3 |
| `{#id, k=v}`       | Content block with block metadata         | §1.3 |

**Block-level** — each of these must begin a line, within a content block.

| Marker    | Element          | Notes                                             | §    |
| --------- | ---------------- | ------------------------------------------------- | ---- |
| `^1`–`^6` | `heading`        | `title`/`subtitle` blocks only; 1 is largest      | §2.1 |
| `:`       | `stageDirection` | Nestable; a bare `:` separates paragraphs         | §2.2 |
| `>`       | `blockquote`     | Nestable; `>>` for a quotation within a quotation | §2.3 |
| `-`       | `list`           | Unordered item; 2-space indent nests              | §2.4 |
| `1.`      | `list`           | Ordered item; any start number, then +1 each      | §2.4 |
| `*`       | `list` (verse)   | Verse line; a blank line starts a new stanza      | §2.5 |
| `\|`      | `table`          | Pipe-separated cells; `\|---\|` marks a header    | §2.6 |
| (none)    | `paragraph`      | Any other line; consecutive lines join            | §2.7 |

**Inline** — anywhere within block content.

| Marker              | Element             | Notes                                     | §    |
| ------------------- | ------------------- | ----------------------------------------- | ---- |
| `"text"`            | `quote`             | Renders with its quotation marks          | §3.1 |
| `*text*`            | `strong`            | Small-caps                                | §3.1 |
| `_text_`            | `emphasis`          | Italics                                   | §3.1 |
| `^text^`            | `superscript`       |                                           | §3.1 |
| `,,text,,`          | `subscript`         |                                           | §3.1 |
| `@text@`            | `speaker`           | Speaker name in dialogue                  | §3.1 |
| `::text::`          | `stageDirection`    | Stage direction within a line             | §3.1 |
| `#text#`            | `aside`             | Margin comment; not rendered as text      | §3.1 |
| `[text]`            | `citation`          | Cited work; renders with its brackets     | §3.1 |
| `[p:text]`          | `person`            |                                           | §3.1 |
| `[l:text]`          | `place`             |                                           | §3.1 |
| `[o:text]`          | `org`               |                                           | §3.1 |
| `$text$`            | `language`          | Foreign text, language unspecified        | §3.1 |
| `$xx:text$`         | `language`          | `lang` = ISO 639 code (`la`, `fr`, `grc`) | §3.1 |
| `[+text+]`          | `insertion`         | Editorial insertion                       | §3.1 |
| `[-text-]`          | `deletion`          | Editorial deletion                        | §3.1 |
| `[?text?]`          | `uncertain`         | Uncertain reading                         | §3.1 |
| `[...]`             | `illegible`         | Wholly illegible; no content              | §3.1 |
| `[w:surface=word]`  | `word`              | Disambiguated form; surface is one token  | §3.5 |
| `<nID>`             | `footnoteReference` | Must match an `{#nID}` block in the text  | §1.3 |
| `~`                 | `nbSpace`           | Non-breaking space; joins a multi-word unit | §3.2 |
| `~~`                | `tab`               | Em space / tab                            | §3.2 |
| `\` + space or EOL  | `lineBreak`         | Hard line break                           | §3.3 |
| `///`               | `pageBreak`         | No page reference                         | §3.1 |
| `//ref//`           | `pageBreak`         | `ref` is any non-whitespace string        | §3.1 |
| `<<tag…>>…<</tag>>` | `element`           | Generic escape hatch; also `<<tag/>>`     | §3.4 |
| `\x`                | (literal `x`)       | Escape any other special character        | §3.3 |

**Transliteration** — input methods; the output holds the resulting characters, not the markers.

| Marker    | Meaning                                                | §    |
| --------- | ------------------------------------------------------ | ---- |
| `{...}`   | Character mode: digraphs, diacritics, special symbols  | §4.1 |
| `{{...}}` | Greek mode: Latin-to-Greek on top of Greek diacritics  | §4.2 |

### 5.2. Precedence

Where two constructs could match at the same position, the parser tries them in this order:

1. Escape (`\`)
2. Greek mode (`{{…}}`), then character mode (`{…}`)
3. Leaf elements, longest first: `~~` before `~`, then `[...]`
4. Page break (`///`, then `//ref//`)
5. Generic element (`<<`) — before footnote references, which use a single `<`
6. Footnote reference (`<nID>`)
7. Language (`$…$`)
8. Word disambiguation (`[w:…=…]`)
9. Wrapper elements, longest first — so `::` beats `:`, `,,` beats `,`, and `[p:`/`[l:`/`[o:`/`[+`/`[-`/`[?` all beat the bare `[` of a citation
10. Plain text — a special character that began no valid construct is literal

Transliteration modes (2) run before everything below them, so inline markup inside `{…}` or `{{…}}` is literal text (§4.3).

### 5.3. Diagnostics

Every diagnostic is recoverable: the compiler emits a message and continues, so a document with errors still compiles to a usable tree.

| Message                                                                | Cause                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------- |
| Document must begin with a level 1 header                              | The first line is not `# id`                              |
| Expected level 1 header but found level _n_                            | The document opens at `##` or deeper                      |
| Level _n_ header cannot follow level _m_ header without an intermediate | A depth was skipped (`#` then `###`)                      |
| Block is missing metadata tag `{#id}`                                  | Content appears before any block tag                      |
| Block tag is not properly closed with `}`                              | Malformed `{#…`                                           |
| Duplicate block ID: `#id`                                              | Two blocks in one text share an ID                        |
| Only one title block is allowed per text                               | A second `{#title}`                                       |
| Title block must be the first block in the text                        | `{#title}` after another block                            |
| Footnote blocks must appear after all paragraph blocks                 | A `{#n…}` block precedes a paragraph block                |
| Footnote not found: _id_                                               | `<nID>` with no matching `{#nID}` block in the same text  |
| Invalid metadata line, expected `key = value`                          | A malformed line in a `[metadata]` block                  |
| Invalid metadata pair, expected `key=value`                            | A malformed pair inside a block tag                       |
| Invalid metadata value: _value_                                        | Not a boolean, number, string, or homogeneous array       |
| Multiline array must have at least one item                            | `key = [` … `]` with nothing between                      |
| Headings are only allowed in title or subtitle blocks                  | `^N` in a paragraph or footnote block                     |
| Heading must be given a level between 1 and 6                          | A bare `^` at the start of a line                         |
| Heading level must be between 1 and 6                                  | `^0`, `^7`, …                                             |
| List item must not be empty                                            | A list marker with no content and no sub-list             |
| Unclosed formatting: _marker_                                          | A wrapper opened and never closed                         |
| Empty formatting: _markers_                                            | A wrapper with no content                                 |
| Unclosed element: `<<tag`                                              | A generic element opened and never closed                 |
| Unclosed Greek mode / Unclosed character mode                          | `{{` or `{` opened and never closed                       |
| Malformed word element; expected `[w:surface=word]`                    | No `=`, or no closing `]`                                 |
| Word surface must be exactly one token                                 | `[w:two words=x]`; mark a multi-word unit with `~` first  |
