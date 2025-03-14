export default (id: string, text: string): string[] => {
  const errors: string[] = [];

  const formattingStack = [];
  let currentFormat;
  let inBlockQuotation = false;
  let inInlineQuotation = false;
  let inGreek = false;

  // loop through each character
  let i = 0;
  while (i < text.length) {
    switch (text[i]) {
      // escaped an special characters
      case "\\":
        if (text[i + 1] === undefined) {
          errors.push(`content cannot end with '\\' (${id})`);
        }
        i += 2;
        break;

      // headings
      case "£": {
        const headingCheck = text.slice(i).match(/^£(\d) (.*?) £(\d)\s?/);
        if (!headingCheck) {
          errors.push(`bad heading tags (${id})`);
          const badHeadingCheck = text.slice(i).match(/^£(.*?)£\s?/);
          i += badHeadingCheck ? badHeadingCheck[0].length : 1;
        } else {
          if (headingCheck[1] !== headingCheck[3]) {
            errors.push(`mismatched heading tags (${id})`);
          } else if (
            parseInt(headingCheck[1]) < 1 ||
            parseInt(headingCheck[1]) > 6
          ) {
            errors.push(`bad heading tags (${id})`);
          }
          i += headingCheck ? headingCheck[0].length : 1;
        }
        break;
      }

      // quotations
      case '"':
        if (text[i + 1] === '"') {
          if (inBlockQuotation) {
            inBlockQuotation = false;
          } else {
            inBlockQuotation = true;
          }
          i += 2;
        } else {
          if (inInlineQuotation) {
            inInlineQuotation = false;
          } else {
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
          i += deletionCheck[0].length;
        } else if (insertionCheck) {
          i += insertionCheck[0].length;
        } else if (replacementCheck) {
          i += replacementCheck[0].length;
        } else {
          if (!rest.match(/^\{AE\}/i) && !rest.match(/^\{OE\}/i)) {
            if (rest.slice(1, 3) === "++") {
              errors.push(`unterminated '{++}' tag (${id})`);
            } else if (rest.slice(1, 3) === "--") {
              errors.push(`unterminated '{--}' tag (${id})`);
            } else if (rest.slice(1, 3) === "~~") {
              errors.push(`unterminated '{~~}' tag (${id})`);
            } else {
              errors.push(`unrecognised ligature (${id})`);
            }
            i += 1;
          } else {
            i += 4;
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
          // TODO: keep track of footnote references to check corresponding note exists in the document
          i += footnoteCheck[0].length;
        } else if (linkCheck) {
          i += linkCheck[0].length;
        } else if (citationCheck) {
          i += citationCheck[0].length;
        } else {
          errors.push(`unterminated '[' tag (${id})`);
          i += 1;
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
          formattingStack.pop();
        } else {
          formattingStack.push(text[i]);
        }
        i += 1;
        break;

      // default
      default:
        i += 1;
        break;
    }
  }

  // final error checking
  if (formattingStack.length > 0) {
    errors.push(
      `unterminated '${inGreek ? "$$" : formattingStack.pop()}' tag (${id})`
    );
  }

  if (inInlineQuotation) {
    errors.push(`unterminated inline quotation (${id})`);
  }

  if (inBlockQuotation) {
    errors.push(`unterminated block quotation (${id})`);
  }

  // return the errors
  return errors;
};
