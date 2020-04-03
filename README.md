# Markit

Markit is a terse markup language similar to Markdown, which compiles to
TEI-XML. It supports YAML metadata, several useful shorthands, and full XML for
when you need rarer tags or greater precision. It is being developed for use in
Oxford University's English Philosophical Texts project, so its features are
geared towards things needed in the markup of those texts; but it could easily
be of wider use. If you are interested in using it in your digital humanities or
TEI-related project, please get in touch. Time permitting, I will be happy to
add features according to your needs.

**N.B.** Markit is still in the earliest stages of development. The
specification is still in flux, and in any case has not yet been fully
implemented or thoroughly tested.

## 1. Usage

...

## 2. The structure of a Markit file

A Markit file is a text file with a `.mit` extension. The start of the file
should contain YAML metadata, enclosed in three dashes on their own line. This
corresponds to the `<teiHeader>` tag of the output file (or to the `<head>` tag
if outputting HTML). The rest of the file corresponds to the `<text>` tag (or to
the `<body>` tag if outputting HTML). For example:

Markit:
```
---
title: Title of the document
author: Author of the document
publicationStmt: Publication details
sourceDesc: Description of the file source
---
This is the first paragraph in the document.

This is the second paragraph. It contains *bold text*, _italic text_, and text
in ^small capitals^.
```

TEI-XML output:
```
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <titleStmt>
      <title>Title of the document</title>
      <author>Author of the document</author>
    <titleStmt>
    <publicationStmt>
      <p>Publication details</p>
    </publicationStmt>
    <sourceDesc>
      <p>Description of the file source</p>
    </sourceDesc>
  </teiHeader>
  <text>
    <body>
      <p>This is the first paragraph in the document.</p>
      <p>This is the second paragraph. It contains <hi rend="bold">bold text</hi>, <hi rend="italic">italic text</hi>, and text in <hi rend="smallcaps">small capitals</hi>.</p>
    </body>
  </text>
</TEI>
```

## 3. Writing Markit files

We recommend using the [Atom text editor](https://atom.io) to create and edit
Markit files. In this editor, you can use `Cmd-Shift-q` or `Ctrl-Shift-q` to
automatically break paragraphs into separate lines. (This is optional, but it
makes Markit files much nicer to read.) More importantly, you can add our
[language-markit](https://github.com/englishphilosophy/language-markit) package,
which provides syntax highlighting for the language. To add this package, press
`Cmd-,` or `Ctrl-,` to open up Atom's settings tab, click `+ Install`, search
for `language-markit` in the search packages box, then click the `Install`
button for this package when it shows up below.

Language support for Visual Studio Code is also in development.

## 4. Further help and documentation

... will be added soon.
