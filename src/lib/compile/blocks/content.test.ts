import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import content from "./content.ts";

describe("compile > blocks > content", () => {
  it("parses special characters", () => {
    // plain text
    assertEquals(content("\\S", "text"), "§");
    assertEquals(content("\\\\", "text"), "\\");
    assertEquals(content("\\*", "text"), "*");
    assertEquals(content("\\_", "text"), "_");
    assertEquals(content("\\^", "text"), "^");
    assertEquals(content("\\{", "text"), "{");
    assertEquals(content("\\[", "text"), "[");

    // html
    assertEquals(content("\\S", "html"), "<p>§</p>");
    assertEquals(content("\\\\", "html"), "<p>\\</p>");
    assertEquals(content("\\*", "html"), "<p>*</p>");
    assertEquals(content("\\_", "html"), "<p>_</p>");
    assertEquals(content("\\^", "html"), "<p>^</p>");
    assertEquals(content("\\=", "html"), "<p>=</p>");
    assertEquals(content("\\{", "html"), "<p>{</p>");
    assertEquals(content("\\[", "html"), "<p>[</p>");
  });

  it("parses ampersands", () => {
    // plain text
    assertEquals(content("&", "text"), "&");

    // html
    assertEquals(content("&", "html"), "<p>&amp;</p>");
    assertEquals(content("&nbsp;", "html"), "<p>&nbsp;</p>");
  });

  it("handles white space", () => {
    // plain text
    assertEquals(content("~~", "text"), "  ");
    assertEquals(content("~", "text"), " ");
    assertEquals(content("//", "text"), "\n");

    // html
    assertEquals(content("~~", "html"), "<p>&emsp;</p>");
    assertEquals(content("~", "html"), "<p>&nbsp;</p>");
    assertEquals(content("//", "html"), "<p><br /></p>");
  });

  it("handles dashes", () => {
    // plain text
    assertEquals(content("{-}", "text"), "–");
    assertEquals(content("{--}", "text"), "—");

    // html
    assertEquals(content("{-}", "html"), "<p>&en;</p>");
    assertEquals(content("{--}", "html"), "<p>&em;</p>");
  });

  it("handles page breaks", () => {
    // plain text
    assertEquals(content("|", "text"), "");

    // html
    assertEquals(
      content("|", "html"),
      '<p><span class="page-break"></span></p>'
    );
  });

  it("handles headings", () => {
    // plain text
    assertEquals(content("£1 title £1", "text"), "title\n");
    assertEquals(content("£2 title £2", "text"), "title\n");
    assertEquals(content("£3 title £3", "text"), "title\n");
    assertEquals(content("£4 title £4", "text"), "title\n");
    assertEquals(content("£5 title £5", "text"), "title\n");
    assertEquals(content("£6 title £6", "text"), "title\n");
    assertEquals(
      content("£1 heading 1 £1 £2 heading 2 £2", "text"),
      "heading 1\nheading 2\n"
    );

    // html
    assertEquals(content("£1 title £1", "html"), "<h1>title</h1>");
    assertEquals(content("£2 title £2", "html"), "<h2>title</h2>");
    assertEquals(content("£3 title £3", "html"), "<h3>title</h3>");
    assertEquals(content("£4 title £4", "html"), "<h4>title</h4>");
    assertEquals(content("£5 title £5", "html"), "<h5>title</h5>");
    assertEquals(content("£6 title £6", "html"), "<h6>title</h6>");
    assertEquals(
      content("£1 heading 1 £1 £2 heading 2 £2", "html"),
      "<h1>heading 1</h1><h2>heading 2</h2>"
    );
  });

  it("handles block quotations", () => {
    // plain text
    assertEquals(
      content('previous text ""blockquote"" subsequent text', "text"),
      "previous text\n\nblockquote\n\nsubsequent text"
    );

    // html
    assertEquals(
      content('previous text ""blockquote"" subsequent text', "html"),
      "<p>previous text</p><blockquote>blockquote</blockquote><p>subsequent text</p>"
    );
  });

  it("handles inline quotations", () => {
    // plain text
    assertEquals(content('"inline quote"', "text"), '"inline quote"');

    // html
    assertEquals(
      content('"inline quote"', "html"),
      "<p><q>inline quote</q></p>"
    );
  });

  it("handles strong text", () => {
    // plain text
    assertEquals(content("*strong*", "text"), "strong");

    // html
    assertEquals(content("*strong*", "html"), "<p><strong>strong</strong></p>");
  });

  it("handles emphasised text", () => {
    // plain text
    assertEquals(content("_emphasis_", "text"), "emphasis");

    // html
    assertEquals(content("_emphasis_", "html"), "<p><em>emphasis</em></p>");
  });

  it("handles small caps", () => {
    // plain text
    assertEquals(content("^smallcaps^", "text"), "smallcaps");

    // html
    assertEquals(
      content("^smallcaps^", "html"),
      '<p><span class="small-capitals">smallcaps</span></p>'
    );
  });

  it("handles foreign text", () => {
    // plain text
    assertEquals(content("$foreign text$", "text"), "[foreign text]");

    // html
    assertEquals(
      content("$foreign text$", "html"),
      '<p><span class="foreign">foreign text</span></p>'
    );
  });

  it("handles greek text", () => {
    // plain text
    assertEquals(content("$$greek tect$$", "text"), "[γρεεκ τεχτ]");

    // html
    assertEquals(
      content("$$greek tect$$", "html"),
      '<p><span class="foreign">γρεεκ τεχτ</span></p>'
    );
  });

  it("handles greek text nested inside foreign text", () => {
    // plain text
    assertEquals(
      content("$foreign text with $$greek tect$$ inside$", "text"),
      "[foreign text with γρεεκ τεχτ inside]"
    );

    // html
    assertEquals(
      content("$foreign text with $$greek tect$$ inside$", "html"),
      '<p><span class="foreign">foreign text with γρεεκ τεχτ inside</span></p>'
    );
  });

  it("handles margin comments", () => {
    // plain text
    assertEquals(content("#margin comment#", "text"), "{margin comment}");

    // html
    assertEquals(
      content("#margin comment#", "html"),
      '<p><span class="margin-comment">margin comment</span></p>'
    );
  });

  it("parses ligatures", () => {
    // plain text
    assertEquals(content("{ae}", "text"), "æ");
    assertEquals(content("{AE}", "text"), "Æ");
    assertEquals(content("{oe}", "text"), "œ");
    assertEquals(content("{OE}", "text"), "Œ");

    // html
    assertEquals(content("{ae}", "html"), "<p>æ</p>");
    assertEquals(content("{AE}", "html"), "<p>Æ</p>");
    assertEquals(content("{oe}", "html"), "<p>œ</p>");
    assertEquals(content("{OE}", "html"), "<p>Œ</p>");
  });

  it("handles editorial insertions", () => {
    // plain text
    assertEquals(content("{++insertion++}", "text"), "insertion");

    // html
    assertEquals(
      content("{++insertion++}", "html"),
      "<p><ins>insertion</ins></p>"
    );
  });

  it("handles editorial deletions", () => {
    // plain text
    assertEquals(content("{--deletion--}", "text"), "");

    // html
    assertEquals(
      content("{--deletion--}", "html"),
      "<p><del>deletion</del></p>"
    );
  });

  it("handles editorial replacements", () => {
    // plain text
    assertEquals(content("{~~old->new~~}", "text"), "new");

    // html
    assertEquals(
      content("{~~old->new~~}", "html"),
      "<p><del>old</del><ins>new</ins></p>"
    );
  });

  it("handles footnote references", () => {
    // plain text
    assertEquals(content("[n1]", "text"), "[n1]");

    // html
    assertEquals(
      content("[n1]", "html"),
      '<p><a href="#n1"><sup>[1]</sup></a></p>'
    );
  });

  it("handles hyperlinks", () => {
    // plain text
    assertEquals(content("[description](url)", "text"), "[description]");

    // html
    assertEquals(
      content("[description](url)", "html"),
      '<p><a href="url">description</a></p>'
    );
  });

  it("handles citations", () => {
    // plain text
    assertEquals(content("[citation]", "text"), "[citation]");

    // html
    assertEquals(content("[citation]", "html"), "<p><cite>citation</cite></p>");
  });

  it("parses nested tags", () => {
    // plain text
    assertEquals(
      content(
        "£1 Heading 1 £1 £2 Heading 2 £2 Paragraph. // This _sentence has ^some *nested*^ tags_.",
        "text"
      ),
      "Heading 1\nHeading 2\nParagraph.\nThis sentence has some nested tags."
    );

    // html
    assertEquals(
      content(
        "£1 Heading 1 £1 £2 Heading 2 £2 Paragraph. // This _sentence has ^some *nested*^ tags_.",
        "html"
      ),
      '<h1>Heading 1</h1><h2>Heading 2</h2><p>Paragraph.<br />This <em>sentence has <span class="small-capitals">some <strong>nested</strong></span> tags</em>.</p>'
    );
  });
});
