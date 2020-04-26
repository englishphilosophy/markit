import { Options } from './options.ts'
import markitToJson from './compile/json.ts'
import jsonToTei from './compile/tei.ts'
import jsonToHtml from './compile/html.ts'
import jsonToTxt from './compile/txt.ts'

export default function markit (inputFilePath: string, config: any = {}): string {
  const options = (config instanceof Options) ? config : new Options(config)

  const json = markitToJson(inputFilePath, options)

  switch (options.format) {
    case 'json':
      return `${JSON.stringify(json)}\n`

    case 'tei':
      return jsonToTei(json, options)

    case 'html':
      return jsonToHtml(json, options)

    case 'txt':
      return jsonToTxt(json, options)
  }
}
