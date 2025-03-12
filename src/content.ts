import greek from "./content/greek.ts";
import { html, txt, type Tag } from "./content/rules.ts";
import * as tag from "./content/tag.ts";
import type { Format } from "./types.ts";

export default (text: string, format: Format): string => {
  const first = innerContent(text, format);
  const second = format === "txt" ? first : `<p>${first}</p>`;
  const third =
    format === "txt"
      ? second.replaceAll(" \n", "\n").replaceAll("\n ", "\n")
      : second
          .replaceAll("<p></p>", "")
          .replaceAll("<p> ", "<p>")
          .replaceAll(" </p>", "</p>")
          .replace(/<p><h(\d)>/g, "<h$1>")
          .replace(/<\/h(\d)><\/p>/g, "</h$1>")
          .replace(/\s+?<br \/>\s+?/g, "<br />");
  return third;
};

const innerContent = (text: string, format: Format) => {
  const rules = format === "txt" ? txt : html;
  const formattingStack = [];
  let currentFormat;
  let inBlockQuotation = false;
  let inInlineQuotation = false;
  let inGreek = false;

  let result = "";
  let i = 0;

  // loop through each character
  while (i < text.length) {
    switch (text[i]) {
      // escaped an special characters
      case "\\":
        if (text[i + 1] === "S") {
          result += "§";
        } else if (text[i + 1]) {
          result += text[i + 1];
        } else {
          throw new Error("content cannot end with '\\'");
        }
        i += 2;
        break;

      // ampersands
      case "&":
        if (format === "html" && !text.slice(i)?.match(/^&[a-z]+;/)) {
          result += "&amp;";
        } else {
          result += text[i];
        }
        i += 1;
        break;

      // spaces
      case "~":
        if (text[i + 1] === "~") {
          result += rules["~~"];
          i += 2;
        } else {
          result += rules["~"];
          i += 1;
        }
        break;

      // line breaks
      case "/":
        if (text[i + 1] === "/") {
          result += rules["//"];
          i += 2;
        } else {
          result += text[i];
          i += 1;
        }
        break;

      // page breaks
      case "|":
        result += rules["|"];
        i += 1;
        break;

      // headings
      case "£": {
        const headingCheck = text.slice(i).match(/^£(\d) (.*?) £(\d)\s?/);
        if (!headingCheck) {
          throw new Error("bad heading tags");
        }
        if (headingCheck[1] !== headingCheck[3]) {
          throw new Error("mismatched heading tags");
        }
        if (parseInt(headingCheck[1]) < 1 || parseInt(headingCheck[1]) > 6) {
          throw new Error("bad heading tags");
        }
        result += rules[`£${headingCheck[1]}` as Tag][0];
        result += innerContent(headingCheck[2], format);
        result += rules[`£${headingCheck[1]}` as Tag][1];
        i += headingCheck[0].length;
        break;
      }

      // quotations
      case '"':
        if (text[i + 1] === '"') {
          if (inBlockQuotation) {
            result += rules['""'][1];
            inBlockQuotation = false;
          } else {
            result += rules['""'][0];
            inBlockQuotation = true;
          }
          i += 2;
        } else {
          if (inInlineQuotation) {
            result += rules['"'][1];
            inInlineQuotation = false;
          } else {
            result += rules['"'][0];
            inInlineQuotation = true;
          }
          i += 1;
        }
        break;

      // ligatures and edits
      case "{": {
        const rest = text.slice(i);
        const deletionCheck = rest.match(/^\{--(.*?)--\}/);
        const insertionCheck = rest.match(/^\{\+\+(.*?)\+\+\}/);
        const replacementCheck = rest.match(/^\{~~(.*?)->(.*?)~~}/);
        if (deletionCheck) {
          result += tag.deletion(innerContent(deletionCheck[1], format), rules);
          i += deletionCheck[0].length;
        } else if (insertionCheck) {
          result += tag.insertion(
            innerContent(insertionCheck[1], format),
            rules
          );
          i += insertionCheck[0].length;
        } else if (replacementCheck) {
          result += tag.replacement(
            innerContent(replacementCheck[1], format),
            innerContent(replacementCheck[2], format),
            rules
          );
          i += replacementCheck[0].length;
        } else {
          // ligature
          if (rest.match(/^\{AE\}/)) {
            result += "Æ";
          } else if (rest.match(/\{ae\}/)) {
            result += "æ";
          } else if (rest.match(/\{OE\}/)) {
            result += "Œ";
          } else if (rest.match(/\{oe\}/)) {
            result += "œ";
          } else if (rest.slice(1, 3) === "++") {
            throw new Error("unterminated '{++}' tag");
          } else if (rest.slice(1, 3) === "--") {
            throw new Error("unterminated '{--}' tag");
          } else if (rest.slice(1, 3) === "~~") {
            throw new Error("unterminated '{~~}' tag");
          } else {
            throw new Error("unrecognised ligature");
          }
          i += 4;
        }
        break;
      }

      // footnotes, links, citations
      case "[": {
        const footnoteCheck = text.slice(i).match(/^\[n([0-9*]+)\]/);
        const linkCheck = text.slice(i).match(/^\[([^\[\]]*?)\]\((.*?)\)/);
        const citationCheck = text.slice(i).match(/^\[((.*?)[^\\])\]/);
        if (footnoteCheck) {
          // TODO: add footnote ID to an array, for checking
          result += tag.footnote(footnoteCheck[1], rules);
          i += footnoteCheck[0].length;
        } else if (linkCheck) {
          result += tag.link(
            innerContent(linkCheck[1], format),
            linkCheck[2],
            rules
          );
          i += linkCheck[0].length;
        } else if (citationCheck) {
          result += tag.citation(innerContent(citationCheck[1], format), rules);
          i += citationCheck[0].length;
        } else {
          throw new Error("unterminated '[' tag");
        }
        break;
      }

      // simple spans
      case "*": // fallthrough
      case "_": // fallthrough
      case "^": // fallthrough
      case "=": // fallthrough
      case "$": // fallthrough
      case "#":
        if (text[i] === "$" && text[i + 1] === "$") {
          inGreek = !inGreek;
          i += 1;
        }
        currentFormat = formattingStack[formattingStack.length - 1];
        if (currentFormat === text[i]) {
          result += rules[text[i] as Tag][1];
          formattingStack.pop();
        } else {
          result += rules[text[i] as Tag][0];
          formattingStack.push(text[i]);
        }
        i += 1;
        break;

      // default
      default:
        if (inGreek) {
          result += greek(text[i]);
        } else {
          result += text[i];
        }
        i += 1;
        break;
    }
  }

  // final error checking
  if (formattingStack.length > 0) {
    throw inGreek
      ? new Error("unterminated '$$' tag")
      : new Error(`unterminated '${formattingStack.pop()}' tag`);
  }

  if (inGreek) {
    throw new Error("unterminated '$$' tag");
  }

  if (inInlineQuotation) {
    throw new Error("unterminated inline quotation");
  }

  if (inBlockQuotation) {
    throw new Error("unterminated block quotation");
  }

  // return the result
  return result;
};
