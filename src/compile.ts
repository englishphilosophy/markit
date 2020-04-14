import { Options } from './types.ts'
import defaults from './options/defaults.ts'
import markitToJson from './compile/json.ts'
import jsonToTei from './compile/tei.ts'
import jsonToHtml from './compile/html.ts'
import jsonToTxt from './compile/txt.ts'

export default function markit (inputFilePath: string, options: Options = defaults): string {
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
