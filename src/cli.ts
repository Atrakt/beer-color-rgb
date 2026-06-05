#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { ebcToHex, srmToHex } from './index.js'
import type { ColorOptions } from './index.js'
import { parseNumber, parseRange, generateCss, generateJson } from './cli-core.js'

const args = process.argv.slice(2)

function help(): void {
  console.log(`beer-color-rgb

Usage:
  beer-color-rgb <ebc>
  beer-color-rgb --srm <srm>
  beer-color-rgb generate --format css|json [--unit ebc|srm] [--output <file>] [--range <min>-<max>] [--path <cm>]

Options:
  --srm <value>      Interpret input as SRM (default: EBC)
  --path <cm>        Optical path length in cm (default: 5). 3 matches historical reference.
  --unit ebc|srm     Unit for generate command (default: ebc)
  --format css|json  Output format for generate
  --range min-max    Value range for generate (default: 1-80 for EBC, 1-40 for SRM)
  --output <file>    Output file (default: stdout)

Examples:
  beer-color-rgb 20
  beer-color-rgb --srm 10
  beer-color-rgb 20 --path 3
  beer-color-rgb generate --format css --output colors.css
  beer-color-rgb generate --format css --unit srm --range 1-40
`)
}

function getArg(flag: string): string | undefined {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : undefined
}

function hasFlag(flag: string): boolean {
  return args.includes(flag)
}

function fail(msg: string): never {
  console.error(msg)
  process.exit(1)
}

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  help()
  process.exit(0)
}

try {
  const rawPath = getArg('--path')
  let pathOptions: ColorOptions = {}
  if (rawPath !== undefined) {
    const p = parseNumber(rawPath)
    if (p === null || p <= 0) fail(`Invalid --path: ${rawPath}. Must be a positive number.`)
    pathOptions = { lightPath: p }
  }

  if (args[0] === 'generate') {
    const format = getArg('--format') ?? 'css'
    const unit = getArg('--unit') ?? 'ebc'
    const output = getArg('--output')
    const [min, max] = parseRange(getArg('--range'), unit)

    let content: string
    if (format === 'css') content = generateCss(min, max, unit, pathOptions)
    else if (format === 'json') content = generateJson(min, max, unit, pathOptions)
    else fail(`Unknown format: ${format}. Use css or json.`)

    if (output) { writeFileSync(output, content, 'utf-8'); console.log(`Written to ${output}`) }
    else process.stdout.write(content)

  } else {
    const isSrm = hasFlag('--srm')
    const raw = isSrm ? getArg('--srm') : args[0]
    const val = parseNumber(raw)
    if (val === null) fail(`Invalid value: ${raw}`)
    console.log(isSrm ? srmToHex(val, pathOptions) : ebcToHex(val, pathOptions))
  }
} catch (err) {
  console.error(`Error: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
}
