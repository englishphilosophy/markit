export default function lemmatize (content: string, lemmas: Record<string, string>): string[] {
  return content
    .replace(/\n/g, ' ') // replace line breaks with spaces
    .replace(/[";:(),.!?]/g, '') // remove punctuation
    .replace(/\[.*?\]/g, '') // remove citations
    .replace(/—/g, ' ') // replace dashes with spaces
    .toLowerCase() // put in lower case
    .split(' ') // split into words
    .filter(x => x.length > 0) // get rid of empties
    .map(x => lemmas[x] || x) // map to lemmas
}
