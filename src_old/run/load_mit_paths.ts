import {
  extname
} from '../../deps.ts'

export default function mits (directory: string): string[] {
  const mitFiles: string[] = []
  for (const dirEntry of Deno.readDirSync(directory)) {
    const fullPath = `${directory}/${dirEntry.name}`
    if (dirEntry.isDirectory) {
      mitFiles.push(...mits(fullPath))
    } else if (dirEntry.isFile && extname(fullPath) === '.mit') {
      mitFiles.push(fullPath)
    }
  }
  return mitFiles
}
