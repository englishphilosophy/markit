import type { Format } from "../../../types.ts";
import greek from "./content/greek.ts";
import { htmlRules, textRules, type Tag } from "./content/rules.ts";
import * as tag from "./content/tag.ts";

export default (text: string, format: Exclude<Format, "markit">): string => {
  const first = innerContent(text, format);
  const second = format === "text" ? first : `<p>${first}</p>`;
  const third =
    format === "text"
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

const innerContent = (text: string, format: Exclude<Format, "markit">) => {
  const rules = format === "text" ? textRules : htmlRules;
  const formattingStack = [];
  let inBlockQuotation = false;
  let inInlineQuotation = false;
  let inForeign = false;
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
        if (headingCheck) {
          result += rules[`£${headingCheck[1]}` as Tag][0];
          result += innerContent(headingCheck[2], format);
          result += rules[`£${headingCheck[1]}` as Tag][1];
          i += headingCheck[0].length;
        } else {
          i += 1;
        }
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

      // dashes, ligatures, and edits
      case "{": {
        const rest = text.slice(i);
        const emDashCheck = rest.match(/^\{--\}/);
        const enDashCheck = rest.match(/^\{-\}/);
        const deletionCheck = rest.match(/^\{--(.*?)--\}/);
        const insertionCheck = rest.match(/^\{\+\+(.*?)\+\+\}/);
        const replacementCheck = rest.match(/^\{~~(.*?)->(.*?)~~}/);
        if (emDashCheck) {
          result += rules["{--}"];
          i += emDashCheck[0].length;
        } else if (enDashCheck) {
          result += rules["{-}"];
          i += enDashCheck[0].length;
        } else if (deletionCheck) {
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
          if (rest.startsWith("{AE}")) {
            result += "Æ";
            i += 4;
          } else if (rest.startsWith("{ae}")) {
            result += "æ";
            i += 4;
          } else if (rest.startsWith("{OE}")) {
            result += "Œ";
            i += 4;
          } else if (rest.startsWith("{oe}")) {
            result += "œ";
            i += 4;
          } else {
            i += 1;
          }
        }
        break;
      }

      // footnotes, links, citations
      case "[": {
        const footnoteCheck = text.slice(i).match(/^\[n([0-9*]+)\]/);
        const linkCheck = text.slice(i).match(/^\[([^\[\]]*?)\]\((.*?)\)/);
        const citationCheck = text.slice(i).match(/^\[((.*?)[^\\])\]/);
        if (footnoteCheck) {
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
          i += 1;
        }
        break;
      }

      // simple spans
      case "*": // fallthrough
      case "_": // fallthrough
      case "^": // fallthrough
      case "$": // fallthrough
      case "#": {
        if (text[i] === "$" && text[i + 1] === "$") {
          inGreek = !inGreek;
          i += 1;
          const currentFormat = formattingStack[formattingStack.length - 1];
          if (currentFormat === "$$") {
            if (!inForeign) result += rules["$"][1];
            formattingStack.pop();
          } else {
            if (!inForeign) result += rules["$"][0];
            formattingStack.push("$$");
          }
        } else {
          if (text[i] === "$") inForeign = !inForeign;
          const currentFormat = formattingStack[formattingStack.length - 1];
          if (currentFormat === text[i]) {
            result += rules[text[i] as Tag][1];
            formattingStack.pop();
          } else {
            result += rules[text[i] as Tag][0];
            formattingStack.push(text[i]);
          }
        }
        i += 1;
        break;
      }

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

  // return the result
  return result;
};
