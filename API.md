# Markit — API Reference

The library surface of `@earlytexts/markit`: what each exported function does, what it returns, and which of them you want for a given job. It assumes you can read TypeScript. For the language itself see the [specification](./SPECIFICATION.md); for writing Markit by hand see the [guide](./GUIDE.md).

## Contents

- [Installing](#installing)
- [Choosing a function](#choosing-a-function)
- [Compiling](#compiling)
- [Formatting](#formatting)
- [Rendering](#rendering-the-display-projection)
- [Extraction and tokenisation](#extraction-and-tokenisation-the-analysis-projection)
- [TEI conversion](#tei-conversion)
- [The document model](#the-document-model)
- [Design notes](#design-notes)

## Installing

The package is published to [JSR](https://jsr.io/@earlytexts/markit) as unbundled TypeScript source, with no runtime dependencies.

```bash
deno add jsr:@earlytexts/markit      # Deno
npx jsr add @earlytexts/markit       # Node, Bun, and everything else
```

Node consumers get it through JSR's npm compatibility layer, as `@jsr/earlytexts__markit` from `npm.jsr.io`. Either way the import specifier is the same:

```typescript
import { compile, renderText } from "@earlytexts/markit";
```

Every export is available from the package root; there are no sub-path entry points.

## Choosing a function

| You want to…                                          | Use                                       |
| ----------------------------------------------------- | ----------------------------------------- |
| Turn Markit source into a document tree               | `compile`                                 |
| …and map results back to source lines and columns     | `compileWithPositions`                    |
| Drop the positions again before storing               | `stripPositions`                          |
| Tidy Markit source                                    | `format`                                  |
| Get the text a reader would see                       | `renderText`                              |
| Get text for indexing, search, or statistics          | `extractText`                             |
| Get the words of a block, with provenance             | `tokenize`                                |
| Mark search hits inside a document                    | `highlight`                               |
| Resolve editorial markup to one reading               | `resolve`                                 |
| Import TEI/TCP XML                                    | `fromTEIXML`                              |
| Export canonical TEI P5 XML                           | `toTEIXML`                                |

The distinction that matters most is between the two text projections. `renderText` is the **display** projection: the text a reader sees, string furniture included. `extractText`/`tokenize` are the **analysis** projection: furniture dropped, provenance carried. They are not interchangeable, and the offsets of one mean nothing in the other.

## Compiling

### `compile(text: string): CompileResult`

Compiles Markit source into a `MarkitDocument`.

```typescript
const { document, errors } = compile(source);
```

The compiler is **error-tolerant**: it always returns a document, even for badly malformed input, and reports what it found in `errors`. This is what makes live preview possible — an editor can render on every keystroke, through every half-typed construct. It also means an empty `errors` array is the only evidence the input was well-formed; a document alone tells you nothing.

Each `MarkitError` carries a `message`, a `severity` of `"error"` or `"warning"`, and a `source` range. Diagnostics come back sorted by position.

### `compileWithPositions(text: string): CompileResult`

Identical, except that every `plainText` node additionally carries a `sources` array — one `{ line, column }` per character of its content. Downstream, this is what gives `Span`s and `Token`s their `source` ranges, so any extracted character can be traced back to where it was written.

The two are separate functions rather than an option because positions are plain serialisable properties: recording them always would multiply the size of stored JSON for consumers who never look at them. Take positions when you are driving an editor or building an index that must point back at source; take plain `compile` when you are producing data.

Positions are also what populate the node-level `source` and `metadataSource` ranges on documents and blocks — whole-line, end-exclusive ranges used for code folding and error attribution.

### `stripPositions<T extends MarkitDocument | Block>(node: T): T`

A deep copy with every position removed — node-level `source` and `metadataSource`, and per-character `sources` — giving back the lean shape `compile` produces. Use it when a pipeline needed positions in the middle but must not store them at the end.

`metadata` records are copied verbatim rather than walked: their keys are author data, so a metadata key literally named `source` survives.

## Formatting

### `format(text: string): string`

Returns the canonical formatting of Markit source. It is the function behind the extension's "Format Document" command, and it is **idempotent** — formatting formatted source returns it unchanged.

What it normalises:

- Whitespace: trailing spaces dropped, runs of spaces collapsed, blank lines collapsed to one, exactly one trailing newline, CRLF normalised to LF.
- Structure: one blank line before every block tag and text heading; content moved onto the line after its block tag.
- Metadata: spaces around `=`, spacing inside inline arrays and block-tag metadata, trailing commas dropped — while preserving whitespace, commas and braces inside quoted strings.
- Block content: paragraphs collapsed onto one line, table columns aligned, ordered lists renumbered from their first item, nested list indents snapped to two spaces, blank lines inserted between adjacent block-level elements.
- Character modes canonicalised: each `{…}` span is rewritten to the characters it compiles to (`{e/}` → `é`), since the braces are an input method rather than structure. A span is left braced only where rewriting could change how the source re-parses — an escape such as `{\$}` whose output is itself a Markit marker.

What it never does: rewrap prose lines, or change any word of the text.

Malformed constructs are left alone. A block tag the parser cannot read is passed through verbatim rather than guessed at, so formatting never destroys work in a file that is mid-edit.

## Rendering (the display projection)

### `renderText(document: MarkitDocument): string`

The plain-text projection of a whole document: what a reader would see. Block structure becomes blank-line separation and indentation; inline wrappers render their content.

String furniture is **kept**, because a reader sees it: quotations render with their `"…"`, citations with their `[…]`, illegible spans as `<illegible>`, footnote references as `<id>`, and footnote blocks with a `[^id]:` prefix. Editorial markup resolves to the edited reading — insertions kept, deletions dropped — and asides render as nothing.

This is a projection for humans. Do not build an index on it, and do not measure offsets against it: use extraction.

## Extraction and tokenisation (the analysis projection)

These work **block by block**, because a block is the retrieval unit in the corpus this language serves.

Each takes a `version`, which decides how editorial markup resolves: `"edited"` (the default) keeps insertions and drops deletions; `"original"` does the reverse. Whichever side is kept is unwrapped, so editorial wrappers never appear in any context.

### `extractText(block: Block, options?: { version?: Version }): Extraction`

Returns `{ text, spans }` — the block's plain text with **all markup furniture dropped**, plus one `Span` per contributing source element.

Every character of `text` is either one element's contribution or a synthetic joiner:

| Source                      | Contributes                                        |
| --------------------------- | -------------------------------------------------- |
| `plainText`                 | its content, verbatim                              |
| `~` (`nbSpace`)             | U+00A0 — so `a~priori` reads as one word           |
| `~~` (`tab`)                | `\t`                                               |
| line break                  | `\n`                                               |
| `[...]` (`illegible`)       | the literal `[...]` — no word characters, so never a false token |
| page break, loose           | a single space (a word boundary)                   |
| page break, tight           | nothing — the word either side joins up            |
| footnote reference          | nothing                                            |
| between block elements, list items, table rows, heading lines | `\n` (a joiner) |
| between table cells         | `" \| "` (a joiner)                                |

A joiner belongs to no span. Every other character belongs to exactly one.

Each `Span` carries `start`/`end` offsets into `text`, its `context` — the full stack of enclosing elements, outermost first — and, from a `compileWithPositions` document, its `source` range.

A `Frame` in that context stack is one of: a plain wrapper (`{ type: "quote" | "strong" | "person" | "citation" | … }`), a language run (`{ type: "language", lang? }`), a word element (`{ type: "word", word }`), a generic element (`{ type: "element", tag, attributes }`), or a highlight.

### `tokenize(block: Block, options?: { version?: Version }): Token[]`

The block's word tokens, in reading order — `wordPattern` run over the extraction above.

```typescript
const { document } = compileWithPositions(source);
const tokens = tokenize(document.blocks[0]);
// { text, start, end, context, word?, lang?, source? }
```

Each `Token` carries:

- `text` — the word, with U+00A0 normalised to a plain space, so a `~`-joined unit reads `"a priori"`.
- `start`/`end` — half-open offsets into `extractText(block, { version }).text`, which holds the raw U+00A0. Offsets index that string, not `token.text`.
- `context` — the wrapper stack, as above.
- `word` — the nearest enclosing `[w:…=word]` value, if any. The disambiguated form for search.
- `lang` — the nearest enclosing language code, if any.
- `source` — the token's `{ line, column }` range in the Markit source, when the block came from `compileWithPositions`. `end` is exclusive.

`word` and `lang` are conveniences distilled from `context`; anything else you need (was this inside a citation? a person's name?) is a scan of the stack.

### `wordPattern: RegExp`

The word alphabet itself, exported for plain-string uses such as segmenting a search query so it tokenises the same way the corpus did:

```
/['’]*[\p{L}\p{N}](?:[\p{L}\p{N}'’]|\.(?=\p{L})|\u00A0(?=[\p{L}\p{N}]))*/gu
```

A token is a run of letters, digits and apostrophes containing at least one letter or digit. Leading, internal and trailing apostrophes are kept (`'tis`, `o'clock`, `lookin'`). Two characters **join** what would otherwise split: an internal period before a letter (`i.e`), and a non-breaking space before a letter or digit (`a priori`). Everything else — hyphens included — separates.

It carries the `g` flag, so it is stateful. Reset `lastIndex`, or use it with `matchAll`, which does not mutate it.

### `highlight(block: Block, ranges: { start, end }[], version?: Version): Block`

A copy of the block, resolved to `version`, with the given ranges of its extracted text wrapped in `highlight` elements. The ranges must be measured against `extractText(block, { version }).text`, and must be sorted and non-overlapping.

This is the same walk as extraction, which is the point: offsets computed from an extraction always line up with the block. Only `plainText` nodes are ever split; characters contributed by other elements are passed over, so a range spanning a line break or page break simply resumes marking on the other side.

The `highlight` element is not Markit syntax — there is no way to write one — but a synthetic node so renderers can find search hits without a parallel type.

### `resolve(block: Block, version: Version): Block`

`highlight` with no ranges: a copy of the block with its editorial markup stripped down to one side's reading text. Use it to produce the edited or original text of a block as a document, rather than as a string.

## TEI conversion

### `fromTEIXML(xml: string, options?: FromTEIOptions): string`

Converts a TEI P5 document into Markit source. Written for the [Text Creation Partnership](https://textcreationpartnership.org/) transcriptions, which is the shape of TEI it has been graded against.

It favours native Markit throughout — emphasis, quotations, lists, verse, footnotes, page breaks, language runs, editorial marks — and falls back to the generic `<<tag>>` element only for markup with no native equivalent, so nothing is lost and the common case stays readable. Page layout is normalised to reading text: end-of-line hyphens closed up, `<g>` glyphs resolved to their Unicode, `<pb>` turned into a Markit page break. The TEI shell (`<text>`, `<front>`/`<body>`, content-free `<div>` wrappers) is flattened away, so a work's own divisions open at `##`.

`options.modernize` opts in to letterform normalisation (long s and similar). The default preserves the source faithfully.

The output is formatter-canonical by construction: running `format` over it is a no-op.

### `toTEIXML(mit: string): string`

The inverse: Markit source to canonical TEI P5 XML. The root text becomes `<TEI>`, its metadata rebuilds a `<teiHeader>`, and the shell `fromTEIXML` flattened is put back: the root's own blocks become the title page in `<front>`, a `front` or `back` sub-text the matter either side, and everything else the `<body>`. Sub-texts become `<div>`s, native inline elements map back to their canonical TEI tags, footnote references re-inline as `<note>`, and generic `<<tag>>` elements are emitted verbatim.

The output is standard P5, not a reproduction of any particular source document's chrome — so a round trip through Markit and back is faithful in content, not byte-identical.

## The document model

Every type is exported. The tree, from the top:

```
MarkitDocument   id, metadata?, blocks, children[]     — a text and its sub-texts
└── Block        id, type, metadata?, content[]        — a {#id} content block
    └── BlockElement                                   — heading | paragraph | blockquote
        │                                                | stageDirection | list | table
        └── InlineElement                               — the leaves of the tree
```

**`MarkitDocument`** is a text. `id` is the dot-joined path from the root (`Title.Chapter1.Section2`); `children` are the texts one heading level deeper.

**`Block`** has a `type` of `"title" | "subtitle" | "footnote" | "paragraph"`, derived from its ID (§1.3 of the specification), and a `content` array of block-level elements.

**`BlockElement`** is `Heading` (whose `content` is one `HeadingLine` per `^N` source line), `Paragraph`, `Blockquote`, `StageDirection`, `List` (`ordered: "ordered" | "unordered" | "verse"`, with `items` that may carry a `nestedList`), or `Table` (`hasHeader`, `rows`, `cells`). `NestableBlockElement` is the same set minus `Heading` — what a quotation or stage direction may contain.

**`InlineElement`** is one of:

- `PlainText` — `content`, plus `sources?` under `compileWithPositions`
- `Wrapper` — `{ type: WrapperType, content }`, where `WrapperType` covers quote, strong, emphasis, superscript, subscript, aside, speaker, stageDirection, insertion, deletion, uncertain, person, place, org and citation
- `Leaf` — `{ type: "tab" | "nbSpace" | "illegible" }`
- `LineBreak`, `FootnoteReference` (`id`)
- `Word` — `{ word, content }`: the disambiguated form and the surface
- `Language` — `{ lang?, content }`
- `PageBreak` — `{ ref?, tight? }`
- `RawElement` — `{ tag, attributes, selfClosing?, content }`
- `Highlight` — synthetic; produced by `highlight`, never parsed

**Metadata.** `Metadata` is an open `Record` of `MetadataValue` (boolean, number, string, or a homogeneous array of one) plus at most one level of nested objects. There is no fixed schema: any keys are preserved as written. Because it is open, positions for a metadata node live in a sibling `metadataSource` property rather than inside the record — a metadata key named `source` must survive untouched.

**Positions.** `SourcePosition` is `{ line, column }`, 0-based. `SourceRange` is `{ start, end }` with `end` exclusive. Node-level ranges are whole-line: a node spanning source lines 2–3 has `start` `{ line: 2, column: 0 }` and `end` `{ line: 4, column: 0 }`. Character-level ranges — on spans and tokens — are exact.

Error positions are the exception: `MarkitError.source` is reported 1-based, since it is read by people.

## Design notes

**Two projections, never mixed.** Display (`renderText`) keeps furniture because a reader sees it; analysis (`extractText`, `tokenize`) drops furniture and carries provenance. Offsets are only ever meaningful against the projection that produced them.

**Extraction, highlighting and resolution share one walk.** That is a correctness property, not an optimisation: it is what guarantees that a range measured on an extraction can be handed straight back to `highlight`.

**Positions are opt-in.** They are ordinary serialisable properties, so a document with them round-trips through JSON — which is exactly why they must not be on by default.

**The escape hatch is deliberately ugly.** `<<tag>>` exists so TEI import can be lossless without the core vocabulary growing to meet every dialect. It carries no display semantics; renderers fall back to emitting its content.
