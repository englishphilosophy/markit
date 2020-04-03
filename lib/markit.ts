import Options from './options.ts'
import markitToJson from './json.ts'
import jsonToTei from './tei.ts'
import jsonToHtml from './html.ts'
import jsonToTxt from './txt.ts'

export default function markit (inputFilePath: string, options: Options): string {
  const json = markitToJson(inputFilePath, options)

  switch (options.format) {
    case 'json':
      return `${JSON.stringify(json, null, 2)}\n`

    case 'tei':
      return jsonToTei(json, options)

    case 'html':
      return jsonToHtml(json, options)

    case 'txt':
      return jsonToTxt(json, options)
  }
}
