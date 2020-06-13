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

1. Install [Deno]() (follow the instructions on their web site).
2. Run `deno install --allow-read --allow-write markit
   https://raw.githubusercontent.com/englishphilosophy/markit/master/bin/markit.ts`.
3. Run `markit path [-o outputDirectory] [-c configFile]`.

In 3 above, `path` is the path to a Markit file to be converted, or a directory
of Markit files. If the latter, all Markit files in that directory (and its
subdirectories) will be converted. By default, output files are placed in the
same directory as their corresponding input file. Override this default with the
optional `-o outputDirectory` directive. Additional options can be placed in a
config file, and passed in using the optional `-c configFile` directive. For
details of all additional options, their defaults, and how to change them, see
section 4 below.

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
```xml
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

Markit files are just text files, and can be written and edited in any text
editor. We recommend using either [Atom](https://atom.io) or [Visual Studio
Code](https://code.visualstudio.com/), which are free and work on all platforms.
A [language-markit](https://github.com/englishphilosophy/language-markit)
extension is available that enables Markit language support in both of these
editors.

To install this extension in Atom, press `Cmd+,` or `Ctrl+,` to open up the
settings tab, click `+ Install`, search for `language-markit` in the search
packages box, then click the `Install` button for this package when it shows up
in the list below. In Visual Studio Code, press `Cmd+Shift+X` or `Ctrl+Shift+X`
to open up the extensions pane, search for `language-markit`, then likewise
click the `Install` button for this extension when it appears.

For readability, it is recommended to hard-wrap lines of text in Markit files to
a maximum of 80 characters. In Atom, you can do this automatically by pressing
`Cmd-Shift-q` or `Ctrl-Shift-q`. In Visual Studio Code, you first need to
install the `rewrap` extension (search for it in the extensions pane just as you
did for `language-markit`); then pressing `Alt+q` will have the same effect.

## 4. Options

... details will be added soon.
