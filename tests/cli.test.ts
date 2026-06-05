import { describe, it, expect } from 'vitest'
import { parseNumber, parseRange, generateCss, generateJson } from '../src/cli-core.js'

describe('parseNumber', () => {
  it('parses valid numbers (incl. surrounding whitespace)', () => {
    expect(parseNumber('20')).toBe(20)
    expect(parseNumber('3.5')).toBe(3.5)
    expect(parseNumber('  5 ')).toBe(5)
  })

  it('rejects trailing garbage (unlike parseFloat)', () => {
    expect(parseNumber('20px')).toBeNull()
    expect(parseNumber('abc')).toBeNull()
  })

  it('rejects empty / whitespace / undefined', () => {
    expect(parseNumber('')).toBeNull()
    expect(parseNumber('   ')).toBeNull()
    expect(parseNumber(undefined)).toBeNull()
  })

  it('rejects NaN and Infinity tokens', () => {
    expect(parseNumber('NaN')).toBeNull()
    expect(parseNumber('Infinity')).toBeNull()
  })
})

describe('parseRange', () => {
  it('returns unit defaults when no range given', () => {
    expect(parseRange(undefined, 'ebc')).toEqual([1, 80])
    expect(parseRange(undefined, 'srm')).toEqual([1, 40])
  })

  it('parses a valid min-max range', () => {
    expect(parseRange('5-10', 'ebc')).toEqual([5, 10])
    expect(parseRange('1-1', 'ebc')).toEqual([1, 1])
  })

  it('throws on inverted range (min > max)', () => {
    expect(() => parseRange('10-5', 'ebc')).toThrow(RangeError)
  })

  it('throws on negative leading dash', () => {
    expect(() => parseRange('-5-10', 'ebc')).toThrow(RangeError)
  })

  it('throws on extra dashes', () => {
    expect(() => parseRange('1-80-extra', 'ebc')).toThrow(RangeError)
  })

  it('throws on incomplete / non-numeric input', () => {
    expect(() => parseRange('1-', 'ebc')).toThrow(RangeError)
    expect(() => parseRange('a-b', 'ebc')).toThrow(RangeError)
    expect(() => parseRange('5', 'ebc')).toThrow(RangeError)
  })
})

describe('generateCss', () => {
  it('emits color + background classes for each value', () => {
    const css = generateCss(1, 2, 'ebc', { lightPath: 5 })
    expect(css).toMatch(/^\/\* EBC beer color classes/)
    expect(css).toContain('.ebc-1 { color: #')
    expect(css).toContain('.ebc-bg-1 { background-color: #')
    expect(css).toContain('.ebc-2 { color: #')
  })

  it('uses the srm prefix for the srm unit', () => {
    const css = generateCss(10, 10, 'srm', { lightPath: 5 })
    expect(css).toContain('.srm-10 { color: #')
    expect(css).toContain('.srm-bg-10 { background-color: #')
  })
})

describe('generateJson', () => {
  it('maps each value to a hex string', () => {
    const json = JSON.parse(generateJson(1, 3, 'ebc', { lightPath: 5 }))
    expect(Object.keys(json)).toEqual(['1', '2', '3'])
    expect(json['1']).toMatch(/^#[0-9a-f]{6}$/)
  })
})
