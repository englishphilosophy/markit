# Markit

Markit is a terse markup language very similar to Markdown, but with a few key
differences described below. It is intended for use in digital humanities
projects, for storing and editing texts in a format that is easy to read and
write, but which can be converted into a more structured format when needed.

Markit provides a _validator_ that checks the syntax of a Markit file, and any
cross-referential errors in the corpus as a whole (e.g. if a parent text refers
to a child text that does not exist).

It also provides a _converter_ that translates Markit files into structured
JSON, with the underlying text itself formatted as either HTML or plain text
(i.e. stripped of all markup - useful for searches and textual analysis).

## 1. Why Does Markit Exist?

If you want to store texts in a structured format for use in digital humanities,
the _de facto_ standard is TEI-XML. The problem with TEI-XML is that is uses
XML, which is:

1. a relatively slow format for computers to work with (compared to JSON, which
   has by and large replaced XML everywhere else); and more importantly
2. an _absolutely horrible_ format for human beings to read and write.

Markdown is a much nicer format for human beings to read and write, and it can
be easily translated into HTML for displaying texts on the web. But:

1. Markdown lacks some markup options that are useful in textual scholarship -
   e.g. for small capitals (a common format in many historical texts), margin
   comments, footnotes, or citations. You can get around these issues somewhat
   by just including your own HTML in a Markdown file - but then you lose
   precisely the benefit of Markdown's conciseness in those cases.
2. Since Markdown is specifically aimed at generating HTML, there aren't any
   standard tools for _stripping_ the markup from a Markdown file, so that you
   can search or analyse the plain text content.
3. More fundamentally, Markdown doesn't have a very satisfactory way to mark up
   the _structure_ of a text (dividing it into books, parts, sections, chapters,
   etc.). This is a deal-breaker in most cases for textual scholarship.

Markit is basically Markdown, but with the three limitations above addressed. It
has some additional markup options for things useful in textual scholarship, it
outputs plain text as well as HTML, and it provides a convenient way to work
with structured texts of arbitrary complexity.

At the moment, the additional markup options are hard-coded to what is needed
for the [English Philosophical
Texts](https://github.com/englishphilosophy/english-philosophical-texts)
project, but I would be more than happy to make it customisable if there is
interest in using it for other projects.

## 2. Usage

There are two ways to use Markit:

1. As a standalone program, which you can install on your computer and run from
   the command line.
2. As a JavaScript/TypeScript library, which you can import into your own
   project.

### 2.1. Command Line Usage

Download the executable (available for Windows and MacOS) from the `build`
directory (above). You can then run the executable from the command line:

```sh
./markit validate [inputDir]
./markit convert [inputDir] [outputDir]
```

### 2.2. Library Usage

Markit is written in TypeScript and runs in Deno. You can get it from the JSR
registry (link).

The repository exposes two functions:

- `compile(path: string, options: CompileOptions): Promise<Markit[]>`: Parses
  the content of one or more Markit files at the given `path`, and returns the
  structured data.

  Options:
  - `contextDirectory: string | null`: optional path to the directory of all
  Markit files in the corpus (`null` by default). - `format: "markit" | "text" |
  "html"`: output format for the text content (`"markit"` by default). -
  `outputDirectory: string | null`: optional path to the directory where the
  output JSON is saved to disk (`null` by default).
  - `emptyOutputDirectory: boolean`: delete all files in the output directory
    before creating the new ones (`true` by default).
  - `clearContextCache: boolean`: optionally clear the context cache for the
    corpus (`false` by default).
- `validate(path: string, options: ValidateOptions): Promise<string[]>`:
  Validates all Markit files in `inputDirectory`. Returns an array of errors.

  Options:
  - `contextDirectory: string | null`: optional path to the directory of all
    Markit files in the corpus (`null` by default).
  - `logErrors: boolean`: optionally log errors to the console as well as
    returning them (`false` by default).
  - `clearContextCache: boolean`: optionally clear the context cache for the
    corpus (`false` by default).

These two functions rely on Deno-specific APIs for reading and writing files. If
you want to use these functions with Node or Bun, let me know. I could add
support for different runtimes, but it's not a priority unless someone asks for
it.

## 3. The Structure of a Markit File

A Markit file is just a text file with a `.mit` extension. The rules for _valid_
Markit are described below. But you might also like to take a look at the
[English Philosophical
Texts](https://github.com/englishphilosophy/english-philosophical-texts)
repository, which has texts illustrating all of the features.

### 3.1. Basic Textual Markup

Basic textual markup looks a lot like Markdown, but there are a few more
options:

| Markit Input         | Meaning                      | HTML Output                                |
| -------------------- | ---------------------------- | ------------------------------------------ |
| `\S`                 | section symbol               | `§`                                        |
| `&`                  | ampersand                    | `&amp;`                                    |
| `~`                  | a space                      | `&nbsp;`                                   |
| `~~`                 | a large space / tab          | `&emsp;`                                   |
| `//`                 | a line break                 | `<br>`                                     |
| `\|`                 | a page break                 | `<span class="page-break"></span>`         |
| `£1 Title £1`        | a level 1 heading            | `<h1>Title</h1>`                           |
| `£2 Title £2`        | a level 2 heading            | `<h2>Title</h2>`                           |
| `£3 Title £3`        | a level 3 heading            | `<h3>Title</h3>`                           |
| `£4 Title £4`        | a level 4 heading            | `<h4>Title</h4>`                           |
| `£5 Title £5`        | a level 5 heading            | `<h5>Title</h5>`                           |
| `£6 Title £6`        | a level 6 heading            | `<h6>Title</h6>`                           |
| `"text"`             | an inline quotation          | `<q>text</q>`                              |
| `""text""`           | a block quotation            | `<blockquote>text</blockquote>`            |
| `*text*`             | strong text                  | `<strong>text</strong>`                    |
| `_text_`             | emphasised text              | `<em>text</em>`                            |
| `^text^`             | small-caps text              | `<span class="small-capitals">text</span>` |
| `$text$`             | foreign text                 | `<span class="foreign">text</span>`        |
| `$$tect$$`           | Greek text in Latin alphabet | `<span class="foreign">τεχτ</span>`        |
| `#text#`             | margin comment               | `<span class="margin-comment">text</span>` |
| `{ae}`               | "ae" ligature                | `æ`                                        |
| `{AE}`               | "AE" ligature                | `Æ`                                        |
| `{oe}`               | "oe" ligature                | `œ`                                        |
| `{OE}`               | "OE" ligature                | `Œ`                                        |
| `{++insertion++}`    | editorial insertion          | `<ins>insertion</ins>`                     |
| `{--deletion--}`     | editorial deletion           | `<del>deletion</del>`                      |
| `{~~old->new~~}`     | editorial change             | `<del>old</del><ins>new</ins>`             |
| `[n1]`               | footnote reference           | `<a href="#n1"><sup>[1]</sup></a>`         |
| `[description](url)` | URL                          | `<a href="url">description</a>`            |
| `[citation]`         | citation                     | `<cite>citation</cite>`                    |

### 3.2. Document Blocks (Title, Paragraphs, Footnotes)

Most white space is meaningless in Markit - line breaks are treated as spaces
(to enable hard wrapping of lines), and spaces at the start and end of lines are
stripped.

However, two consecutive line breaks divide the text up into _blocks_ - in the
same way that two consecutive line breaks divide text into paragraphs in
Markdown. The differences from Markdown are that each block of text may be a
title, paragraph, or footnote; and that blocks can contain metadata.

Metadata is given inside curly brackets at the start of a block, as a
comma-separated list of key-value pairs:

```
{key1=value1,key2=value2,key3=value3}
```

An exeption is the `title` key, which indicates that the block is a title, and
takes no associated value. Each file can have at most one title block.

All blocks must have an `id` property. This should conventionally be a number.
If the `id` starts with an `"n"` (e.g. `id=n12`), the block is treated as a
footnote; otherwise it is treated as a paragraph. The `title` block should _not_
have an `id` - its `id` will be equal to that of the document (see below).

### 3.3. Metadata

Markit files _must_ include some metadata at the top of the file, before the
text content. Metadata is written in YAML format, and is separated from the text
by a line containing only three dashes (`---`) before and after the metadata:

```yaml
---
id: Author.Title
title: Title of the Document
author: Author Name
date: 2021-01-01
---
The text content goes here.
```

You can include any metadata you want (in addition to the `id`, which is
required - see below). When the file is converted to JSON, whatever fields you
have included will be included in the JSON output.

## 4. Representing Structured Texts

Each individual Markit file has a relatively flat structure: there's metadata,
and then just an array of blocks of text. But most of the time we're dealing
with texts that have more complicated structures - divided into books, parts,
chapters, sections, etc.

In a nutshell, the way Markit handles this is by having _separate files_ for
each part of a text (including one for the text as a whole). Parts higher up in
the hierarchy can reference parts lower down. For example, a whole text might
reference books 1, 2, and 3; book 1 might reference chapters 1, 2, and 3;
chapter 1 might reference sections 1, 2, and 3; and section 1 might contain the
actual text content. (Parts higher up can include text content too, e.g. the
title of that book, chapter, or section.)

### 4.1. Children Texts and Marking Up Structure

To make this work, each text in your corpus _must_ include an `id` field in the
metadata, which _must_ be a unique string identifier for the document (unique in
your corpus, that is).

You can then create a hierarchy of texts by using the `texts` field in the
metadata. For example:

```yaml
---
id: Author.Book
title: Title of the Book
author: Author Name
texts:
  - Author.Book.Section1
  - Author.Book.Section2
---
{title}
Title of the Book
```

The `texts` field is optional, but if present it _must_ be an array of strings,
where each string is the ID of another text in the corpus.

If the `texts` field is present in a Markit file, the JSON output will include a
`children` field, which contains the metadata of each of the children. This is
useful for creating more efficient user interfaces for reading the texts -
saving you from having to read the JSON files for each child separately when
e.g. creating tables of contents.

**Note:** For this to work, you must include a path to the `contextDirectory`
for your corpus in the `options` to the `compile` function. The compiler will
treat all the Markit files in this directory as part of your corpus.

### 4.2. IDs, Parent Texts, and Metadata Inheritance

IDs also serve to indicate the _parent_ text of each text in your corpus, based
on the following convention: if you have a text with the ID
`Author.Title.Part1`, its parent is the text with the ID `Author.Title` (and
_its_ parent is the text with the ID `Author`).

If you have a text with the ID `Author.Title.Chapter1`, you _must_ also have
texts with the IDs `Author.Title` and `Author`. (Note that the `Author` "text"
need not actually represent a _text_ - it can just be a container for metadata
about that author.) In other words, if a text does not have a parent in your
corpus, its ID cannot contain any full-stops.

In the JSON output, texts will inherit metadata from their parents (and their
grandparents, etc., all the way up.) Properties of the same name lower down in
the ancestry will override those higher up.

To aid further in the creation of user interfaces for reading the texts, the
JSON output for each text will also include a `next` and `previous` field (where
appropriate), with metadata for the next and previous part of the text. E.g. the
next text after `Author.Title` would be `Author.Title.Section1`, and the next
text after `Author.Title.Section1` would be `Author.Title.Section2`. This works
by first looking for the text's parent (according to its ID), and then looking
for the next or previous text in the `texts` array of that parent (although the
full algorithm is a bit more complex than that, so as to handle cases at the
start and end of the arrays sensibly).

### 4.3. Why Is the Parent-Child Relationship Marked in Two Ways?

A parent text specifies its children in the `texts` field, and a child text
(implicitly) specifies its parent in its ID. It's possible for these two things
to come apart - a parent text can reference a child that has a _different_
parent according to its ID.

This is intentional, and allows for a some flexibility that may be useful in
certain cases. In the English Philosophical Texts project, for example, this is
used to handle the case of published correspondence between two authors. The way
we represent this is by having _two_ parent texts (one for each author), each of
which references _all_ the letters (by both authors) in its `texts` field. Each
letter, meanwhile, has just _one_ parent according to its ID - the "copy" of the
parent text for the author of that letter.
