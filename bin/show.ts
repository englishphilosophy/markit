import { green, red } from '../deps.ts'

const line = ''.padEnd(70, '-')
const v = 'v0.0.0'

export function error (error: any) {
  console.log(red(` Error: ${error.message}`))
  if (error.inputFilePath) {
    console.log(red(` Input file path: ${error.inputFilePath}`))
  }
  if (error.textId) {
    console.log(red(` Text ID: ${error.textId}`))
  }
  if (error.blockId) {
    console.log(red(` Block ID: ${error.blockId}`))
  }
  console.log(green(line))
}

export function header () {
  console.log(green(line))
  console.log(green(` MarkIt ${v}`))
  console.log(green(line))
}

export function help () {
  console.log(' Usage: markit file/directory [-c markit.config.json]')
  console.log(green(line))
}

export function info (message: string) {
  console.log(` ${message}`)
}

export function success (message: string) {
  console.log(green(` Success: ${message}`))
  console.log(green(line))
}

export function version () {
  console.log(v)
}
