import { ebcToRgbArray as _ebcToRgbArray, toHex } from './convert.js'

export type RgbObject = { r: number; g: number; b: number }

/**
 * Options for color conversion functions.
 * @property lightPath - Optical path length in cm (default: 5.0).
 *   5.0 cm matches BJCP color guide standard viewing conditions.
 *   3.0 cm matches the historical Python CSS reference output.
 *   1.27 cm matches the ASBC/EBC laboratory measurement standard.
 */
export type ColorOptions = { lightPath?: number }

const DEFAULT_PATH = 5.0

// -- EBC Functions --

/**
 * Converts EBC to a Hex color string (e.g., "#F8E785").
 */
export function ebcToHex(ebc: number, options: ColorOptions = {}): string {
  const [r, g, b] = _ebcToRgbArray(ebc, options.lightPath ?? DEFAULT_PATH)
  return toHex(r, g, b)
}

/**
 * Converts EBC to a functional CSS RGB string (e.g., "rgb(248, 231, 133)").
 */
export function ebcToRgb(ebc: number, options: ColorOptions = {}): string {
  const [r, g, b] = _ebcToRgbArray(ebc, options.lightPath ?? DEFAULT_PATH)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * Converts EBC to an RGB object (e.g., { r: 248, g: 231, b: 133 }).
 */
export function ebcToRgbObject(ebc: number, options: ColorOptions = {}): RgbObject {
  const [r, g, b] = _ebcToRgbArray(ebc, options.lightPath ?? DEFAULT_PATH)
  return { r, g, b }
}

/**
 * Converts EBC to a raw RGB array (e.g., [248, 231, 133]).
 */
export function ebcToRgbArray(ebc: number, options: ColorOptions = {}): [number, number, number] {
  return _ebcToRgbArray(ebc, options.lightPath ?? DEFAULT_PATH)
}

// -- SRM Functions --

/**
 * Converts SRM to a Hex color string.
 */
export function srmToHex(srm: number, options: ColorOptions = {}): string {
  return ebcToHex(srm * 1.97, options)
}

/**
 * Converts SRM to a functional CSS RGB string.
 */
export function srmToRgb(srm: number, options: ColorOptions = {}): string {
  return ebcToRgb(srm * 1.97, options)
}

/**
 * Converts SRM to an RGB object.
 */
export function srmToRgbObject(srm: number, options: ColorOptions = {}): RgbObject {
  return ebcToRgbObject(srm * 1.97, options)
}

/**
 * Converts SRM to a raw RGB array.
 */
export function srmToRgbArray(srm: number, options: ColorOptions = {}): [number, number, number] {
  return ebcToRgbArray(srm * 1.97, options)
}
