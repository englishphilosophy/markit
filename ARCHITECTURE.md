# Markit — Architecture

For anyone changing the compiler, human or otherwise. It covers how the code is arranged and why, the invariants worth protecting, and where to put a new feature. For the language see the [specification](./SPECIFICATION.md); for the public surface see the [API reference](./API.md).

## Contents

- [The shape of the repository](#the-shape-of-the-repository)
- [The compile pipeline](#the-compile-pipeline)
- [Error tolerance](#error-tolerance)
- [Positions](#positions)
- [The grammar tables](#the-grammar-tables)
- [The two projections](#the-two-projections)
- [The formatter](#the-formatter)
- [TEI conversion](#tei-conversion)
- [The language server](#the-language-server)
- [Conventions](#conventions)
- [Testing](#testing)

## The shape of the repository

```
src/
├── compile.ts         # Public: Markit string → document (compileWithPositions adds positions)
├── stripPositions.ts  # Public: strip positions back out of a document
├── format.ts          # Public: autoformat a Markit string (orchestration only)
├── renderText.ts      # Public: compiled document → plain text (display projection)
├── extract.ts         # Public: extractText / highlight / resolve (analysis projection)
├── tokenize.ts        # Public: block → word tokens (over the extraction)
├── fromTei.ts         # Public: TCP/TEI XML → Markit source
├── toTei.ts           # Public: Markit source → canonical TEI P5 XML
├── types.ts           # Public: the language's type definitions
├── index.ts           # Public entry point (re-exports)
├── compile/           # Compiler pipeline stages
├── format/            # Formatter state-machine handlers
├── tei/               # TEI walkers, schema tables, XML reader
└── lib/               # Shared internals, incl. grammar.ts
```

The top level **is** the public API: one module per exported function, re-exported by `index.ts`. Directories beneath hold that module's implementation. If you are adding an export, it gets a top-level module; if you are adding a helper, it goes in the directory belonging to the module that calls it, or in `lib/` when two of them need it.

The VS Code language-server extension lives alongside `src/` in [markit-language/](./markit-language/), as a separate npm package bundled with esbuild.

Every module is ordered by the **stepdown rule**: the export first, then the helpers it calls, then the helpers those call. A module reads top to bottom from intent into detail.

`types.ts` is types only — no values. That is what lets `index.ts` re-export it with `export type *` without JSR documenting the grammar constants as part of the public surface, which is also why those constants live in `lib/grammar.ts` instead.

## The compile pipeline

`compile` is four stages, each a pure function returning `[result, errors]`:

```
source string
  │
  ├─ 1. splitIntoBlocks    lines → raw blocks, with line numbers and char offsets
  ├─ 2. generateTextTree   raw blocks → the tree of texts (# / ## / ###)
  ├─ 3. parseMetadata      [metadata] blocks and block-tag pairs → Metadata records
  └─ 4. parseContent       block lines → block elements → inline elements
  │
document + sorted errors
```

**1. `splitIntoBlocks`** divides the source on structural lines: text IDs (`# id`), bracket headers (`[metadata]`), and block tags (`{#id}`) always start a new block, as does a blank line outside a content block. Blank lines *inside* a content block are preserved as empty entries, because the content parser needs them as element boundaries. Each line keeps its line number and character offset, which is what every later position derives from.

**2. `generateTextTree`** reads the `#` prefixes into a nested tree, checking that the document opens at level 1 and that no level is skipped. It builds a flat list first and nests afterwards.

**3. `parseMetadata`** walks the tree and parses the TOML-ish `key = value` pairs, both the `[metadata]` blocks on texts and the inline pairs in block tags. Values are boolean, number, string, or a homogeneous array (`parseMetadataValue`).

**4. `parseContent`** is the largest stage and has two levels. `parseContent` itself classifies lines into block-level elements — via `classifyBlockLine` and the specs in `grammar.ts` — handling the nesting of blockquotes and stage directions by stripping one marker and recursing. `parseElements` then parses each element's text into inline elements, character by character, in the fixed precedence order given in §5.2 of the specification.

The stage boundaries are worth keeping. Each is separately testable and separately benchmarked (`bench/compile.bench.ts` times all four over a synthetic 1.5 MB document shaped like the largest corpus text).

## Error tolerance

**The compiler always produces a document.** This is the load-bearing design decision, and everything else bends to it: an editor renders a live preview on every keystroke, which means it compiles half-typed constructs constantly, and a compiler that threw would make that impossible.

So there is no error path. Every invalid construct has a defined fallback — nearly always "treat the marker as literal text and carry on" — and pushes a `MarkitError` onto the accumulator. Stages return `[result, errors]`; `compile` concatenates and sorts by position.

When adding a construct, the question is not "what do I throw?" but "what does this degrade to?" The answers already in the code:

- An unclosed wrapper: the open marker becomes literal text, and everything after it parses normally.
- A malformed block tag: passed through verbatim, so the formatter cannot destroy work in a file mid-edit.
- A `[w:…]` with no `=`: left as literal text.
- A skipped heading level: the section is created anyway, at the level written.

Diagnostics are merged and sorted at the top only. Do not filter within a stage: a stage does not know what the others found.

## Positions

Positions exist so that an extracted character, a token, or a folding range can be traced back to the source. They come in two granularities:

- **Node-level** — `source` and `metadataSource` on documents and blocks. Whole-line and end-exclusive: a node spanning lines 2–3 has `end` at `{ line: 4, column: 0 }`. Used for folding and error attribution.
- **Character-level** — the `sources` array on `plainText` nodes, one `{ line, column }` per character, built by `buildPositionMap`. Used to give spans and tokens exact source ranges.

Both are populated only by `compileWithPositions`, and both are plain serialisable properties — which is precisely why they are opt-in. A corpus catalogue that stored them would be several times larger for no benefit. `stripPositions` is the inverse, for pipelines that need positions in the middle but not at the end.

Two rules:

- **0-based internally, 1-based in public errors.** `makeError` does the conversion. Nothing else should.
- **Positions never go inside `metadata`.** That record is an open map of author-supplied keys, so a key named `source` must survive; the range lives in a sibling `metadataSource` property instead. `stripPositions` copies `metadata` verbatim rather than walking it, for the same reason.

## The grammar tables

The markers the parser matches are constants in `lib/grammar.ts`, not literals scattered through the parsers: `headingSpec`, `blockquoteSpec`, `stageDirectionSpec`, `listSpec`, `tableSpec`, `leafElements`, `footnoteReferenceSpec`, `wrapperElements`, `wordSpec`, `elementSpec`.

The element *types* are derived from those tables rather than written twice — `WrapperType` is `(typeof wrapperElements)[number]["type"]` — so adding a wrapper to the table adds it to the type, and every exhaustive `switch` over inline elements stops compiling until it is handled. That is the intended workflow: **add the entry, then follow the type errors.** The places that will complain are `renderText`, `extract` (`frameOf`, `leafText`), the TEI emitters, and the extension's HTML renderer.

Ordering within a table matters where one marker prefixes another. `leafElements` lists `~~` before `~`; wrappers are sorted by open-marker length at match time (`wrapperElementsByLength`), so `::` beats `:` and `[p:` beats `[`.

## The two projections

A compiled document has two text projections, and conflating them is the easiest mistake to make in this codebase.

**Display** (`renderText`) is what a reader sees, so it keeps string furniture: quotation marks, citation brackets, `<illegible>`, footnote anchors. It works over a whole document.

**Analysis** (`extract.ts`) drops all furniture and carries provenance. It works over a single block, because a block is the retrieval unit in the corpus this language serves.

`extractText`, `highlight` and `resolve` are **one walk** (`walkBlock`/`walkInline` over a `State`), not three implementations. That is a correctness property: it guarantees a range measured against an extraction can be handed straight back to `highlight` and land in the right place. If you add an inline element, add it to that one walk and both sides follow.

The walk's contract:

- Every character of the extracted text is either one element's contribution (recorded as a `Span` with the current context stack) or a synthetic joiner between structure (belonging to no span).
- Editorial insertions and deletions are resolved to one `version` and the kept side is *unwrapped*, so an editorial frame never appears in a context stack.
- A non-breaking space extracts as a real U+00A0, which is what makes `a~priori` one token with no adjacency bookkeeping anywhere; `tokenize` normalises it back to a space in `Token.text` only.

`tokenize` sits on top, running `wordPattern` over the extraction and walking the span list with a forward cursor. That cursor is sound because a token's first character is always a word character or apostrophe, which only a `plainText` contribution can produce — so every token starts inside a span, and matches arrive in order.

## The formatter

`format.ts` is orchestration only: normalise line endings, `reduce` the lines through `formatLine`, flush. Everything else is in `format/`.

It is a **line-oriented state machine**, not a re-serialisation of the compiled tree. `State` carries a context (`start`, `afterId`, `inMetadata`, `inMetadataArray`, content), an accumulator, a content buffer, and whether the last emitted line was blank. Content lines are buffered and flushed as a group through `extractBlockElements`, which is what lets tables align and ordered lists renumber.

Two invariants:

- **Idempotence.** `format(format(x)) === format(x)`, tested directly. Any new rule must be a fixed point.
- **Never lose text.** A construct the formatter cannot parse is emitted verbatim. This is why block tags are handled before whitespace normalisation — a quoted string inside a tag must keep its internal spacing.

`canonicaliseCharacterModes` is the one place the formatter rewrites content: a `{…}` span becomes the characters it compiles to, since transliteration is an input method rather than structure. A span is kept braced when rewriting could change how the source re-parses — an escape whose output is itself a Markit marker.

## TEI conversion

`fromTei.ts` and `toTei.ts` are a matched pair over `tei/`: `structure.ts` (the shell that is flattened and rebuilt), `header.ts` (`<teiHeader>` ↔ metadata), `contentXml.ts`/`emitText.ts` (the two directions of content), `schema.ts` (the tag tables), and `xml.ts` (a small reader, so there is no XML dependency).

Two things to preserve:

- **Native first, generic as fallback.** Every TEI construct with a Markit equivalent maps to it; only the long tail becomes `<<tag>>`. Widening the generic path is easy and always the wrong first move — it is what keeps imported text readable.
- **`fromTEIXML` output is a formatter fixed point by construction.** `splitLineBreaks` is shared between the formatter and the TEI emitter precisely so this holds. Check it when changing either.

The round trip is faithful in content, not bytes: `toTEIXML` emits canonical P5, not a reproduction of the source document's chrome.

## The language server

`markit-language/` is a standard LSP client/server split. The server (`src/server/`) provides diagnostics, folding ranges and formatting; the client (`src/client/`) provides the preview webview and the three compile commands.

The pattern throughout is **pure planner, thin adapter**: `lib/diagnosticPlan.ts` and `lib/foldingPlan.ts` hold the logic and know nothing of LSP types; `documentDiagnostics.ts` and `documentFolding.ts` only map the plain results onto the protocol. New server features follow the same split — that is what keeps the interesting parts unit-testable.

Two performance notes: compiles are shared through `compileCache.ts` (diagnostics and folding would otherwise compile the same document twice), and diagnostics are trailing-debounced by 200 ms, because recompiling a large document on every keystroke feels sluggish.

## Conventions

- **TypeScript strict**, all options on. `noUncheckedIndexedAccess` means array access is `T | undefined`; the `!` assertions in the hot loops are load-bearing and each has a comment saying why the index is sound.
- **ES modules** with explicit `.ts` extensions (`verbatimModuleSyntax`).
- **Functional style**: arrow functions, no `function` keyword, no classes, recursive tree traversal, minimal mutable state. The extraction walk's `State` is the deliberate exception — a single mutable accumulator threaded through one walk.
- **Editor-only data stays out of the serialised shape.** Intermediate line bookkeeping lives on the pipeline's own types (`RawBlock`, `TextTree`), never on `MarkitDocument`; what *is* on the document — `source`, `metadataSource`, `sources` — is opt-in and removable by `stripPositions`.
- **`deno fmt` with defaults**; markdown excluded.
- **No runtime dependencies.** The library depends on nothing, and should stay that way — it is the base of everything else in the project.

## Testing

The core keeps **100% coverage**, enforced by review rather than by a threshold flag: run `deno task test:coverage` after every change, and if coverage drops, add tests or delete the unreachable code until it is back. Defensive branches that cannot be hit are dead code here, not prudence.

Tests are grouped by surface (`compile.*`, `format.*`, `extract`, `tokenize`, `render.text`, `tei.*`), with `test/utils/factories.ts` for building expected trees. Write the test first: the expected tree *is* the specification of the change.

`deno task bench` times each pipeline stage over a synthetic document at corpus scale. Run it when touching the parsers.

The full check before finishing: `deno task test`, `deno task check`, `deno task fmt:check` — all three run in CI, along with `deno publish --dry-run`.
