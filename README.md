# Markit

A markup language for preserving early texts — designed to be read and written by people, and compiled to structured data for machines.

It is what you would get if Markdown had been designed for a scholarly edition rather than a README: the same idea of markers that stay out of the way, extended to the things transcribers of hand-press books actually need — page breaks, damaged type, editorial emendation, foreign runs, Greek, ambiguous spellings, marginalia.

```
{#12, pages="34"}
BUT the omission of a trifling circumstance will often, by law, invalidate a
contract, $la:in foro humano$, but not $la:in foro conscienti{ae}$, as
[p:*Malebranche*] and other divines express themselves<n7>. //35// The
magistrate is supposed only to withdraw his power of [-inforcing-][+enforcing+]
the right.
```

That is a whole paragraph of an edition: block number, printed page, a Latin tag marked as Latin, a person marked as a person, a footnote reference, the page turn where it fell, and an editorial correction that keeps both readings. It still reads as prose, and it still diffs as prose — which TEI-XML, the standard alternative, does not.

The compiler turns it into JSON, and from there into plain text, HTML, or TEI P5.

## Where to go

| If you are…                                | Read                                                       |
| ------------------------------------------- | ---------------------------------------------------------- |
| Transcribing a text                        | **[Writing Markit](./GUIDE.md)** — the tutorial            |
| Looking up a construct                     | [The specification](./SPECIFICATION.md), and its [element index](./SPECIFICATION.md#5-element-index) |
| Using the compiler in your own code        | [The API reference](./API.md)                              |
| Installing or configuring the editor       | [The extension](./markit-language/README.md)               |
| Changing the compiler                      | [Architecture](./ARCHITECTURE.md)                          |

## Getting started

1. Install [VS Code](https://code.visualstudio.com/).
2. Install the [Markit extension](https://marketplace.visualstudio.com/items?itemName=earlytexts.markit-language) — syntax highlighting, live error reporting, folding, formatting, and a live HTML preview.
3. Write in a `.mit` file, following the [guide](./GUIDE.md).
4. Preview with `Cmd/Ctrl+Shift+V`; compile to JSON, HTML or text from the command palette.

## Using it in code

```bash
deno add jsr:@earlytexts/markit      # Deno
npx jsr add @earlytexts/markit       # Node, Bun, and everything else
```

```typescript
import { compile, renderText, tokenize } from "@earlytexts/markit";

const { document, errors } = compile(source);
const text = renderText(document);            // the display projection
const words = tokenize(document.blocks[0]);   // the analysis projection
```

The compiler is error-tolerant: `compile` always returns a document, and reports what it found in `errors`. There are no runtime dependencies. Full surface — formatting, extraction, tokenisation, TEI conversion, the type definitions — in the [API reference](./API.md).

## Development

```bash
deno task test          # run the tests (test:coverage for a coverage report)
deno task check         # typecheck + lint
deno task fmt           # format in place (fmt:check to verify)
deno task bench         # benchmark the compile pipeline
```

The core keeps 100% test coverage. See [the architecture notes](./ARCHITECTURE.md) before making a change.

The VS Code extension is a separate npm package in [markit-language/](./markit-language/) (`npm run build`, `npm run package`).

## Licence

MIT — see [the licence](./LICENSE.md).
