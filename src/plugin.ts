import { ebcToHex, srmToHex } from './index.js'
import type { ColorOptions } from './index.js'

interface PluginOptions {
  ebcRange?: [number, number] | false  // default [1, 80]
  srmRange?: [number, number] | false  // default [1, 40]
  lightPath?: number                   // default 5
}

interface TailwindHelpers {
  addUtilities: (utilities: Record<string, Record<string, string>>) => void
  matchUtilities: (utilities: Record<string, (value: string) => Record<string, string>>) => void
  theme?: (path: string) => string | undefined
}

type ThemeFn = (path: string) => string | undefined

/** Reads a numeric @theme value, falling back to `fallback` when missing, empty, or non-numeric. */
function themeNumber(theme: ThemeFn | undefined, key: string, fallback: number): number {
  const raw = theme?.(key)
  if (raw === undefined || raw.trim() === '') return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

export function beerColorPlugin(options: PluginOptions = {}) {
  return function({ addUtilities, matchUtilities, theme }: TailwindHelpers): void {
    const rawLightPath = options.lightPath ?? themeNumber(theme, '--beer-light-path', 5)
    const lightPath = rawLightPath > 0 ? rawLightPath : 5

    const ebcRange: [number, number] | false =
      options.ebcRange === false ? false : [
        options.ebcRange?.[0] ?? themeNumber(theme, '--beer-ebc-start', 1),
        options.ebcRange?.[1] ?? themeNumber(theme, '--beer-ebc-end',   80),
      ]

    const srmRange: [number, number] | false =
      options.srmRange === false ? false : [
        options.srmRange?.[0] ?? themeNumber(theme, '--beer-srm-start', 1),
        options.srmRange?.[1] ?? themeNumber(theme, '--beer-srm-end',   40),
      ]

    const colorOpts: ColorOptions = { lightPath }
    const utilities: Record<string, Record<string, string>> = {}

    if (ebcRange) {
      for (let ebc = ebcRange[0]; ebc <= ebcRange[1]; ebc++) {
        const hex = ebcToHex(ebc, colorOpts)
        utilities[`.ebc-${ebc}`] = { color: hex }
        utilities[`.ebc-bg-${ebc}`] = { backgroundColor: hex }
      }
    }

    if (srmRange) {
      for (let srm = srmRange[0]; srm <= srmRange[1]; srm++) {
        const hex = srmToHex(srm, colorOpts)
        utilities[`.srm-${srm}`] = { color: hex }
        utilities[`.srm-bg-${srm}`] = { backgroundColor: hex }
      }
    }

    addUtilities(utilities)

    // Arbitrary values: ebc-bg-[35], srm-[10]
    matchUtilities({
      'ebc':    (v): Record<string, string> => { const n = parseFloat(v); return Number.isFinite(n) ? { color: ebcToHex(n, colorOpts) } : {} },
      'ebc-bg': (v): Record<string, string> => { const n = parseFloat(v); return Number.isFinite(n) ? { backgroundColor: ebcToHex(n, colorOpts) } : {} },
      'srm':    (v): Record<string, string> => { const n = parseFloat(v); return Number.isFinite(n) ? { color: srmToHex(n, colorOpts) } : {} },
      'srm-bg': (v): Record<string, string> => { const n = parseFloat(v); return Number.isFinite(n) ? { backgroundColor: srmToHex(n, colorOpts) } : {} },
    })
  }
}

export default beerColorPlugin()
