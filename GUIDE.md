# Writing Markit

A tutorial for transcribers. It teaches the language in the order you meet it while transcribing a real book: the shape of a document first, then the words on the page, then the awkward things — Greek, damaged type, ambiguous spellings — as they come up.

You do not need to know how to program, and you do not need to read this in one sitting. Work through Part 1, then come back to the later parts when a page throws something at you.

Two companion documents:

- The [specification](./SPECIFICATION.md) is the complete, exact statement of the syntax. When this guide says "usually" or "in practice", the specification says what is actually legal. Its [element index](./SPECIFICATION.md#5-element-index) is the one page to keep open while you work.
- The [corpus](https://github.com/earlytexts/corpus) documents _editorial policy_ — which of the things you _can_ mark you _should_ mark, and how to decide. This guide teaches the language; the corpus tells you what to do with it.

---

## Contents

1. [Before you start](#1-before-you-start)
2. [Your first document](#2-your-first-document)
3. [The shape of a text](#3-the-shape-of-a-text)
4. [The words on the page](#4-the-words-on-the-page)
5. [Footnotes](#5-footnotes)
6. [Page breaks](#6-page-breaks)
7. [Characters you cannot type](#7-characters-you-cannot-type)
8. [Greek](#8-greek)
9. [Foreign text](#9-foreign-text)
10. [Names and citations](#10-names-and-citations)
11. [Verse, lists, quotations, tables and dialogue](#11-verse-lists-quotations-tables-and-dialogue)
12. [Editorial judgement](#12-editorial-judgement)
13. [Ambiguous words](#13-ambiguous-words)
14. [Let the formatter tidy up](#14-let-the-formatter-tidy-up)
15. [Reading the error list](#15-reading-the-error-list)
16. [Where next](#16-where-next)

---

## 1. Before you start

Markit is a way of typing an early modern book into a plain text file so that both a person and a computer can read it. The point of it is that it stays legible: a Markit file looks like the book, not like a database record. Compare the same sentence in TEI XML and in Markit:

```xml
<p>A <hi rend="italic">Treatise</hi> of <hi rend="smallcaps">Human</hi> Nature.</p>
```

```markit
A _Treatise_ of *Human* Nature.
```

Both say the same thing, and the compiler turns the second into structured data. But you can read the second aloud, and you can correct it without counting angle brackets.

**What you need:**

1. [Visual Studio Code](https://code.visualstudio.com/) — a free text editor from Microsoft.
2. The [Markit extension](https://marketplace.visualstudio.com/items?itemName=earlytexts.markit-language) — install it from within VS Code (the Extensions panel in the sidebar, then search for "Markit"). It gives you colouring, a live preview, tidying, and an error list that updates as you type.

If you are transcribing for the Early Text Centre corpus, install the [Compositor](https://github.com/earlytexts/corpus) as well; it adds everything to do with the corpus itself — finding a text, checking spellings, submitting your work — on top of what this guide covers.

**One convention before we begin.** Markit files end in `.mit`. Everything in a `.mit` file is either text you are transcribing or a _marker_ — a character with a special meaning, like the `_` around _Treatise_ above. If you need one of those characters literally, put a backslash before it: `\_` gives you a plain underscore. That is the only escape you have to remember.

---

## 2. Your first document

Create a file called `test.mit` and type this:

```markit
# Test

[metadata]
title = "My first transcription"

{#1}
This is the first paragraph of the text.
```

Save it, then press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux) to open the preview beside your file. You should see the paragraph rendered.

Three things are going on, and they are the only three structural ideas in the language.

**`# Test` opens a _text_.** Every Markit file begins with one, and it is the container for everything below. `Test` is its ID — a short label, no spaces. Nothing else about the file matters until this line is right.

**`[metadata]` opens a block of facts about the text.** They are written one per line as `key = value`. Strings go in double quotes, numbers and `true`/`false` do not, and lists go in square brackets:

```
[metadata]
title = "A Treatise of Human Nature"
published = [1739, 1740]
imported = true
```

There is no fixed set of keys — Markit will keep whatever you write. (Which keys a corpus _expects_ is a separate question, answered by that corpus.)

**`{#1}` opens a _content block_.** This is the unit of transcribed text: usually one paragraph of the book, sometimes a title page or a footnote. Everything after the tag, until the next tag, is that block's content. The `1` is the block's ID; blocks are conventionally numbered from 1 within each text.

Add a second block:

```markit
{#2}
This is the second paragraph.
```

That is the whole skeleton. A transcription is a text, some metadata, and a run of numbered blocks.

---

## 3. The shape of a text

### 3.1. Sections

Real books have parts, chapters and sections. You nest texts by adding `#` characters — `##` is one level down from `#`, `###` one below that, and so on. Here is the real opening of Hume's _Treatise_ in the corpus, cut down:

```markit
# Hume.THN.1739-40

[metadata]
title = "A Treatise of Human Nature"
published = [1739, 1740]

{#title}
^5 A
^1 TREATISE
^6 OF
^2 Human Nature :

## Intro

[metadata]
title = "Introduction"

{#title}
^1 _INTRODUCTION._

{#1}
NOTHING is more usual and more natural...

## 1

[metadata]
title = "Book 1, Of the Understanding"

### 1

[metadata]
title = "Part 1. Of Ideas, their Origin..."

#### 1

[metadata]
title = "Section 1. Of the Origin of our Ideas"

{#1}
ALL the perceptions of the human mind...
```

Each section has its own ID, its own metadata, and its own blocks, and the block numbering starts again at 1 in each. IDs only have to be unique among their _siblings_ — that is why every section here can be called `1`. The compiler joins them up for you: the ID of that last block, in full, is `Hume.THN.1739-40.1.1.1.1`.

Two rules the compiler will enforce:

- The file must open at level 1 (`#`), exactly once.
- You cannot skip a level. `#` followed by `###` is an error; put the `##` in between.

A section with no blocks of its own — Book 1, above — is perfectly normal. It exists to hold its children and to carry a title.

### 3.2. The title block

A block whose ID is `title` is the text's title page or chapter heading. It is the only place (along with `subtitle` blocks) where you can use _heading lines_, which start with `^` and a number from 1 to 6:

```markit
{#title}
^5 A
^1 TREATISE
^6 OF
^2 Human Nature :
^5 BEING
^4 An *Attempt* to introduce the experimental Method of Reasoning
```

The number is **relative display size**, not outline depth: `^1` is the largest, `^6` the smallest. This is how you record a title page that shouts A TREATISE and murmurs "of". Read the page, judge the sizes, and number accordingly. There can be at most one `title` block per text, and it must come first; `subtitle` blocks can appear anywhere and as often as you like.

### 3.3. Block IDs

The ID you give a block decides what kind of block it is:

| ID              | Kind      | Where it goes                        |
| --------------- | --------- | ------------------------------------ |
| `title`         | Title     | At most one, first in the text       |
| `subtitle`      | Subtitle  | Anywhere, any number                 |
| `n1`, `n2`, `na` | Footnote | After all the paragraph blocks       |
| anything else   | Paragraph | Anywhere                             |

So `{#1}` is a paragraph, `{#n1}` is a footnote, and that is the whole of it. (A footnote ID is `n` plus at least one more character; a block called just `{#n}` is an ordinary paragraph.) Two blocks in the same text may not share an ID.

### 3.4. Block metadata

A block tag can carry facts of its own, as comma-separated pairs after the ID:

```markit
{#1, pages="xii"}
{#4, speaker="Philo"}
{#12, pages="34-35", subsection="Of the passions"}
```

These are for facts about _this paragraph_: which printed page it falls on, who is speaking in a dialogue, which running subsection it sits under. The syntax is the same as text metadata (strings quoted, numbers bare), but there are no nested tables.

---

## 4. The words on the page

Now the actual transcription. Inside a block, type what the book says.

### 4.1. Paragraphs and line breaks

**Do not preserve the printed line breaks.** A block is a paragraph; where the lines fell is an artefact of the page, not of the text. Type the paragraph as one long line, or break it wherever is comfortable — Markit joins consecutive lines into one paragraph, and multiple spaces collapse to one.

```markit
This is a paragraph.
This is the same paragraph, because there is no blank line between.

This is a second paragraph.
```

A blank line starts a new paragraph _within_ the same block. Most of the time you will not want one: use a new block instead.

When a line break is genuinely part of the text — an imprint, a date line, a formula — force it with a backslash at the end of the line:

```markit
London: \
Printed for [p:*John Noon*], 1739.
```

(A backslash counts as a line break only when a space or the end of the line follows it. Anywhere else it is the escape character from §1, so `\_` is a literal underscore and `\\` is a literal backslash.)

Two more spacing markers, for when spacing carries meaning:

- `~` a non-breaking space, which also glues two words into one for search purposes (see §13)
- `~~` a wide space or tab

### 4.2. Italics, small caps, quotation

The three you will use constantly:

| You type   | You get                | Used for                         |
| ---------- | ---------------------- | -------------------------------- |
| `_text_`   | _italics_              | Emphasis, titles, Latin tags     |
| `*text*`   | small capitals         | Names in older printing, stress  |
| `"text"`   | a quotation            | Quoted matter                    |

Note that `*` is **small caps, not bold** — early modern printing does not use bold, and it does use small caps heavily. From the corpus:

```
^1 _The *Stoic*<n1>._
```

Italic title, small-capped word inside it, footnote reference after it.

Quotation marks are markup rather than characters: you type `"like this"` and Markit records a quotation _and_ renders the marks. You do not need to hunt for typographic quotes.

These nest, and the nesting can be partial:

```markit
_a _b_ c_
```

is one italic phrase with a roman `b` inside it — which is exactly how the printer set it, and exactly what Markit records.

### 4.3. Superscript, subscript, and marginal notes

```
Mr^r^ Hume            superscript
H,,2,,O               subscript
#Counsell what.#      a marginal note
```

The `#...#` form is for **marginal notes and shoulder notes** — the printed asides in the outer margin, common in seventeenth-century books. Put them at the point in the text they sit beside. From Hobbes:

```markit
{#1}
How fallacious it is to judge of the nature of things,#_Counsell what._# by the ordinary and inconstant use of words...
```

An aside is preserved and rendered as a margin note, but it is held apart from the reading text: it is dropped when the text is rendered as plain prose.

---

## 5. Footnotes

Footnotes are two halves: a reference where the marker appears in the text, and a block holding the note.

The reference is `<n1>` — an angle bracket, the letter `n`, and an identifier. The note is a block whose ID is the same:

```markit
{#1}
There is this obvious Difference in the Conduct of Nature<n1>, with regard to Man...

{#2}
Acknowledge, therefore, O Man, the Beneficence of Nature<n2>...

{#n1}
See [NOTE \[T\]].

{#n2}
The author of _L'Esprit des Loix_. This illustrious writer, however, sets out with a
different theory...
```

Two rules:

- **All footnote blocks go after all the paragraph blocks**, at the end of the text. Not where the note was printed — the compiler will refuse.
- **Every reference must have a matching block** in the same text. `<n3>` with no `{#n3}` is an error, and so it should be: it is nearly always a typo.

The identifier after `n` is up to you. Printed books often mark notes with symbols (`*`, `†`, `‡`) or letters; the usual practice is to number them `n1`, `n2`, `n3` in the order they appear, since the identifier is a cross-reference rather than a transcription of the printed mark. A note's content is ordinary block content, so it can hold italics, citations, verse — anything a paragraph can.

---

## 6. Page breaks

A page break records where one printed page ended and the next began:

```
///                  a page break, no reference
//34//               a page break onto page 34
```

Put the reference — the page number or signature as printed — between the slashes when you have one.

**Watch where you put it.** A page break with a space on either side is an ordinary word boundary. A page break with no space on either side falls _inside a word_, which is what happens when a word is broken across a page:

```markit
...at the be///ginning of the...
```

Markit records this as a "tight" break, joins the word back up for reading and for search, and still knows the page turned mid-word. So: type the break exactly where the type broke, and do not add spaces to tidy it.

---

## 7. Characters you cannot type

Early texts are full of characters that are not on your keyboard: æ, œ, é, à, ç, §, an en-dash. You can paste them in if you have them, and Markit will keep them. But there is an easier way to type them: **character mode**, written in curly braces.

```
{ae}      æ         {AE}     Æ
{oe}      œ         {OE}     Œ
{c,}      ç         {C,}     Ç
{e/}      é         {a`}     à
{a^}      â         {a"}     ä
{$}       §         {-}      –        {--}   —
```

The pattern for diacritics is: the base letter, then the mark. Acute is `/`, grave is `` ` ``, circumflex is `^`, diaeresis is `"`.

You can put several characters in one pair of braces: `{Cae}sar` gives Cæsar, and `{oe}conomy` gives œconomy.

**These braces disappear.** Character mode is an _input method_, not markup: `{e/}` and a pasted `é` compile to exactly the same thing. In fact, when you format the file (§14) the editor rewrites `{e/}` to `é` for you, so the braces are scaffolding you type once and never see again.

One consequence: inline markup does not work inside braces. `{_x_}` gives you literal underscores, not italics. Close the braces first.

---

## 8. Greek

Ancient Greek gets its own input mode, in **double** braces, so you can type it on a Latin keyboard:

```
{{logos}}           →  λογος
{{Kalon}}           →  Καλον
{{a)/nthrwpos}}     →  ἄνθρωπος
```

The letters map as you would expect (`a`→α, `b`→β, `g`→γ, …), with `w`→ω, `x`→ξ, and `u`/`y` both →υ. A final `s` at the end of a word automatically becomes ς.

Four letters are typed as **digraphs**, and are matched before single letters: `th`→θ, `ph`→φ, `ch`→χ, `ps`→ψ. This is worth committing to memory, because there is no `q` or `f` in the table: type `q` for theta and you will silently get a Latin q sitting in your Greek. If a letter is not in the table it passes through untouched, so a stray Latin character is exactly what a mistake looks like.

Breathings and accents go **after** the letter they belong to:

| Marker  | Mark                     |
| ------- | ------------------------ |
| `)`     | smooth breathing         |
| `(`     | rough breathing          |
| `/`     | acute                    |
| `` ` `` | grave                    |
| `^`     | circumflex               |
| `"`     | diaeresis                |
| `\|`    | iota subscript           |

When a letter takes more than one, write them in this order: **breathing, then accent, then diaeresis or iota subscript**. So `a)/` is ἄ. Getting the order wrong produces the wrong character silently — the compiler cannot tell the difference — so it is worth checking the preview on the first few.

In practice you will often be transcribing Greek that a printer set unaccented, in which case none of this arises: `{{Kalon twn blaberwn ouden}}` and you are done.

Greek is also foreign text, so it usually wants a language marker around it too — see the next section.

---

## 9. Foreign text

Mark a run of text in another language with dollar signs and an [ISO 639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) code:

```
$la:in foro humano$                 Latin
$fr:Quand on le sçait...$           French
$grc:Καλον των βλαβερων ουδεν$      Ancient Greek
$it:...$   $es:...$   $he:...$      and so on
```

The bare form `$text$` marks text as foreign without saying which language. Use it only when you genuinely cannot tell.

This matters more than it looks. Foreign words are held out of the corpus's English word register, so an unmarked Latin tag shows up as a page full of misspellings. Mark the language and the noise disappears. From Hume:

```markit
But the omission of a trifling circumstance will often, by law, invalidate a
contract, $la:in foro humano$, but not $la:in foro conscientiæ$, as divines
express themselves.
```

Note that the markers surround only the Latin, not the surrounding English, and the comma stays outside.

Combining the two input modes: Greek inside a language marker is written `$grc:{{...}}$` while you are typing it, and after formatting becomes `$grc:...$` with real Greek characters.

---

## 10. Names and citations

Four markers pick out the things a scholar wants to look up:

```
[p:*Malebranche*]                  a person
[l:*London*]                       a place
[o:the Royal Society]              an organisation
[De Rep. lib. v. p. 457.]          a citation
```

The first three take a prefix letter; square brackets with no prefix are a citation. Note that the markup goes _outside_ the formatting: the printer set Malebranche in small caps, so the `*` markers sit inside the `[p:`.

(Beware the one collision: `[...]`, three dots and nothing else, is the illegible marker from §12, not an empty citation.)

A citation renders with its brackets, because that is usually how it was printed:

```markit
$grc:Καλον των βλαβερων ουδεν$, says [p:*Plutarch*] [_de vitioso pudore_].
```

Like foreign text, these markers hold their contents out of the English word register — which is the practical reason to be diligent about them. Whether a given phrase counts as a person, a place, or neither is an editorial question with real edge cases (is "the Duke of York" a person or a place?), and it is answered by the corpus's markup policy, not here.

---

## 11. Verse, lists, quotations, tables and dialogue

### Verse

Every line of verse begins with `*` in the left margin, and a blank line ends the stanza:

```markit
* Fear no more the heat o' the sun,
* Nor the furious winter's rages;
* Thou thy worldly task hast done,
* Home art gone, and ta'en thy wages.

* Golden lads and girls all must,
* As chimney-sweepers, come to dust.
```

(The `*` at the start of a line is a verse line; the `*` around a word is small caps. They do not collide.)

### Lists

```markit
- an unordered item
- another
  - a nested one, indented two spaces

1. an ordered item
2. another

7. a list that starts at seven
8. and carries on
```

Ordered lists renumber from whatever the first item says, so you only have to get the first number right.

### Block quotations

A quoted passage set as its own block — the epigraph on a title page, a long quotation set in from the margin — is marked with `>` at the start of each line:

```markit
> _$la:Rara temporum felicitas, ubi sentire, quæ velis$_ ; _& quæ sentias, dicere licet._ [*Tacit.*]
```

A blank `>` line separates paragraphs within the quotation, and a quotation can hold anything a block can — lists, verse, a table, even another quotation (with `>>`):

```markit
> As the argument runs:
>
> - first the premise,
> - then the inference.
>
> * And a snatch of quoted verse
> * closes the passage.
```

### Tables

Cells separated by pipes; add a row of dashes under the first row if it is a header:

```markit
| Nation  | Exports | Imports |
| ------- | ------- | ------- |
| England | 300     | 240     |
| France  | 190     | 210     |
```

Without the dashes, the table has no header row. You do not need to line the pipes up — the formatter does that.

### Dialogue

In dialogues (Hume's _Dialogues concerning Natural Religion_, for instance), the speaker's name and any stage business are marked inline:

```markit
@Philo@ ::rising:: But surely, [p:*Cleanthes*], you must acknowledge...
```

A stage direction that stands on its own, between speeches, goes at the start of its lines with `:`:

```markit
: They walk out into the garden.
:
: A second paragraph of stage business.
```

For a long dialogue it is usually better to put the speaker in block metadata — `{#4, speaker="Philo"}` — and use `@...@` only where the name is actually printed in the line.

---

## 12. Editorial judgement

Four markers for the places where the page and the text come apart.

**The type is damaged, but you can read it.** Mark the reading as uncertain:

```markit
the [?revenous?] Animals of the Desert
```

**The type is gone entirely.** Mark the gap:

```markit
and sink thyself [...] those Animals
```

**You are correcting the text.** An insertion is what you are adding; a deletion is what you are removing. They usually come as a pair:

```markit
AS when there are [-more Minds than one,-][+other Minds, besides the chief one;+]
```

This is the one place where a Markit file holds two texts at once. Nothing is thrown away: the compiler can produce either the **original** reading (deletions kept, insertions dropped) or the **edited** reading (the reverse), from the same file. A reader gets the edited text; a scholar collating editions gets the original. That is why the pair is written in full rather than the text simply being corrected.

Use insertion and deletion for _editorial_ intervention — an emendation, a correction from a later edition. Do not use them for ordinary transcription decisions; a printer's obvious turned letter is just transcribed correctly.

---

## 13. Ambiguous words

Early spelling collapses distinctions that modern spelling keeps. "Humane" in 1739 is sometimes our _humane_ and sometimes our _human_; only you, reading the sentence, can tell which. A word element records both, without changing what the reader sees:

```markit
but of very little use in [w:humane=human] Life
```

The part before the `=` is the **surface** — exactly what is printed, and exactly what renders. The part after is the **word** it stands for, which is never displayed but is what a search for "human" will find.

You only need this where the spelling is genuinely ambiguous. Ordinary old spellings — "vertue", "seem'd", "compleat" — are handled by the corpus's dictionary, once, for the whole corpus; you do not mark them in the text. Reach for `[w:]` only when the same printed form means two different things in different places.

The surface has to be **exactly one word**. If the thing you want to disambiguate is two words, glue them with `~` first:

```markit
[w:a~priori=a priori]
```

Which brings up the other use of `~`. A fixed multi-word expression — _a priori_, _ab initio_, the archaic _to morrow_ — is one lexical item printed with a space in the middle. Writing it `a~priori` tells the corpus to treat it as one word, so it can carry one dictionary entry instead of confusing "a" and "priori" separately. It is also correct typography, since the phrase should not break across a line.

---

## 14. Let the formatter tidy up

Press `Alt+Shift+F` and the file rearranges itself. This is not cosmetic — it is worth doing constantly, for three reasons.

**It normalises what you typed.** Blank lines collapse to one, stray spaces go, tables line their pipes up, ordered lists renumber, nested list indents snap to two spaces, and every block gets exactly one blank line before it.

**It resolves character mode.** `{e/}` becomes `é`, `{ae}` becomes `æ`, `{--}` becomes `—`. You type the braces; the formatter cashes them in. (A braced span is left alone only where rewriting it would change the meaning — an escape like `{\$}`, whose output is itself a marker.)

**It is a check on your syntax.** The formatter re-reads the file's structure to lay it out. If a block does not move where you expected, it is usually because the compiler is reading it as something other than what you intended.

The formatter never rewraps your prose lines and never changes your words. Running it twice does nothing the second time.

---

## 15. Reading the error list

The extension compiles as you type and underlines problems; `Cmd+Shift+M` / `Ctrl+Shift+M` lists them all. Nothing here stops the file working — Markit always compiles, and the preview always renders — but a clean file is the goal.

The ones you will actually see:

| Message                                             | What happened                                                          |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| Document must begin with a level 1 header           | The first line is not `# Something`                                    |
| Level 3 header cannot follow level 1 header…        | You jumped from `#` to `###`; add the `##`                             |
| Block is missing metadata tag `{#id}`               | Text appears before any `{#…}` — usually a block tag lost in an edit   |
| Duplicate block ID: `#4`                            | Two `{#4}` blocks in one text; renumber                                |
| Footnote blocks must appear after all paragraph blocks | Move the `{#n…}` blocks to the end of the text                      |
| Footnote not found: n7                              | `<n7>` with no `{#n7}` block — a typo, or a note you have not typed yet |
| Unclosed formatting: `_`                            | An italic opened and never closed — nearly always a real error         |
| Empty formatting: `**`                              | Two markers with nothing between them                                  |
| Unclosed character mode                             | A `{` with no `}`                                                      |
| Word surface must be exactly one token              | `[w:two words=x]` — join them with `~` (§13)                           |
| Headings are only allowed in title or subtitle blocks | A `^2` line in an ordinary paragraph block                           |
| Only one title block is allowed per text            | The second one probably wants to be a `subtitle`                       |

"Unclosed formatting" is the one to take seriously. Because markers are ordinary characters, an unpaired `_` or `*` swallows the rest of the paragraph, and the preview will show you a page of italics. Look for a missing partner near where the italics start.

---

## 16. Where next

- The [specification](./SPECIFICATION.md) — every construct, exactly stated, with a [one-page element index](./SPECIFICATION.md#5-element-index).
- The [extension's README](./markit-language/README.md) — every command, shortcut and snippet.
- The [corpus](https://github.com/earlytexts/corpus) — editorial policy, the dictionary, and how to contribute a text.
- The [API reference](./API.md) — if you want to process Markit files programmatically.
