import {
  dirname,
  existsSync,
  extname,
  green
} from '../deps.ts'
import { Options } from './options.ts'
import loadMitPaths from './run/load_mit_paths.ts'
import compileAndSave from './run/compile_and_save.ts'

export default function convert (inputPath: string, outputPath?: string, config: any = {}) {
  // if input path doesn't exist and doesn't end in '.mit', add '.mit'
  if (!existsSync(inputPath) && extname(inputPath) !== '.mit') {
    inputPath += '.mit'
  }

  // check path exists
  if (!existsSync(inputPath)) {
    throw new Error(`File/directory ${inputPath} does not exist.`)
  }

  // get input path stat object
  const inputPathStat = Deno.statSync(inputPath)

  // set output directory path
  const outputDirectoryPath = outputPath || (inputPathStat.isFile ? dirname(inputPath) : inputPath)

  // initialise options
  const options = new Options(config)

  // either convert all markit files in the directory
  if (inputPathStat.isDirectory) {
    const mitFiles = loadMitPaths(inputPath)
    console.log(`Found ${mitFiles.length} MIT files in '${inputPath}'. Converting to ${options.format.toUpperCase()}...`)
    for (const inputFilePath of mitFiles) {
      compileAndSave(inputPath, inputFilePath, outputDirectoryPath, options)
    }
    console.log(green(`${mitFiles.length} files created.`))
    if (options.createLogFile) {
      mitFiles.sort()
      Deno.writeTextFileSync('markit.log', mitFiles.join('\n'))
      console.log('markit.log file created.')
    }
  }

  // or convert single file
  else if (inputPathStat.isFile) {
    console.log(`Converting MIT file '${inputPath}' to ${options.format.toUpperCase()}...`)
    compileAndSave(dirname(inputPath), inputPath, outputDirectoryPath, options)
    console.log(green('1 file created.'))
  }

  // or throw an error
  else {
    throw new Error(`Input path ${inputPath} is not a file or directory.`)
  }
}
