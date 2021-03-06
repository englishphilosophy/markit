import {
  existsSync,
  extname
} from '../../../deps.ts'

export default function read (inputFilePath: string): string {
  if (!existsSync(inputFilePath) && extname(inputFilePath) !== '.mit') {
    inputFilePath += '.mit'
  }

  if (!existsSync(inputFilePath)) {
    throw new Error(`File '${inputFilePath}' does not exist.`)
  }

  const stat = Deno.statSync(inputFilePath)
  if (!stat.isFile) {
    throw new Error(`'${inputFilePath}' is not a file.`)
  }

  if (extname(inputFilePath) !== '.mit') {
    throw new Error (`'${inputFilePath}' is not a Markit (.mit) file.`)
  }

  try {
    return Deno.readTextFileSync(inputFilePath).replace(/\r\n/g, '\n')
  } catch (error) {
    throw new Error(`Failed to read contents of '${inputFilePath}'.`)
  }
}
