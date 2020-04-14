import {
  extname
} from '../../deps.ts'

export default function mits (directory: string): string[] {
  const allFiles = Deno.readdirSync(directory)
  const mitFiles: string[] = []
  allFiles.forEach((fileInfo) => {
    const fullPath = `${directory}/${fileInfo.name}`
    if (fileInfo.isDirectory()) {
      mitFiles.push(...mits(fullPath))
    } else if (fileInfo.isFile() && extname(fullPath) === '.mit') {
      mitFiles.push(fullPath)
    }
  })
  return mitFiles
}
