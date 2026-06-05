import { describe, it, expect } from 'vitest'
import { beerColorPlugin } from '../src/plugin.js'

describe('beerColorPlugin', () => {
  it('returns a function (Tailwind plugin shape)', () => {
    const plugin = beerColorPlugin()
    expect(typeof plugin).toBe('function')
  })

  it('addUtilities receives ebc-bg-20 with correct hex (at default lightPath=5)', () => {
    const plugin = beerColorPlugin({ ebcRange: [20, 20], srmRange: false })
    const utilities: Record<string, any> = {}
    plugin({ addUtilities: (u: any) => Object.assign(utilities, u), matchUtilities: () => {} } as any)
    
    // EBC 20 à 5cm est plus sombre que #d88900 (valeur à 3cm)
    const hex = utilities['.ebc-bg-20'].backgroundColor
    expect(hex).toMatch(/^#[0-9a-f]{6}$/)
    expect(hex).not.toBe('#d88900')
  })

  it('addUtilities receives srm classes when srmRange set', () => {
    const plugin = beerColorPlugin({ ebcRange: false, srmRange: [10, 10] })
    const utilities: Record<string, any> = {}
    plugin({ addUtilities: (u: any) => Object.assign(utilities, u), matchUtilities: () => {} } as any)
    expect(utilities['.srm-bg-10']).toBeDefined()
    expect(utilities['.srm-10']).toBeDefined()
  })

  it('lightPath option affects output color', () => {
    const p3 = beerColorPlugin({ ebcRange: [20, 20], srmRange: false, lightPath: 3 })
    const p5 = beerColorPlugin({ ebcRange: [20, 20], srmRange: false, lightPath: 5 })
    const u3: Record<string, any> = {}
    const u5: Record<string, any> = {}
    p3({ addUtilities: (u: any) => Object.assign(u3, u), matchUtilities: () => {} } as any)
    p5({ addUtilities: (u: any) => Object.assign(u5, u), matchUtilities: () => {} } as any)
    expect(u3['.ebc-bg-20']).not.toEqual(u5['.ebc-bg-20'])
    expect(u3['.ebc-bg-20'].backgroundColor).toBe('#d88900')
  })

  it('matchUtilities returns empty object for invalid arbitrary value', () => {
    const plugin = beerColorPlugin({ ebcRange: false, srmRange: false })
    let capturedMatchers: Record<string, (v: string) => Record<string, string>> = {}
    plugin({
      addUtilities: () => {},
      matchUtilities: (u: any) => { capturedMatchers = u },
    } as any)
    expect(capturedMatchers['ebc']('abc')).toEqual({})
    expect(capturedMatchers['ebc-bg']('NaN')).toEqual({})
    expect(capturedMatchers['srm']('')).toEqual({})
  })
})

describe('beerColorPlugin (v4 theme helper)', () => {
  const makeHelpers = (themeValues: Record<string, string>, out: Record<string, any>) => ({
    addUtilities: (u: any) => Object.assign(out, u),
    matchUtilities: () => {},
    theme: (key: string) => themeValues[key],
  })

  it('reads lightPath from theme() when not set in JS options', () => {
    const plugin = beerColorPlugin({ ebcRange: [20, 20], srmRange: false })
    const utilities: Record<string, any> = {}
    plugin(makeHelpers({ '--beer-light-path': '3' }, utilities) as any)
    expect(utilities['.ebc-bg-20'].backgroundColor).toBe('#d88900')
  })

  it('JS option takes priority over theme() value', () => {
    const plugin = beerColorPlugin({ ebcRange: [20, 20], srmRange: false, lightPath: 3 })
    const utilities: Record<string, any> = {}
    plugin(makeHelpers({ '--beer-light-path': '99' }, utilities) as any)
    expect(utilities['.ebc-bg-20'].backgroundColor).toBe('#d88900')
  })

  it('reads ebcRange from theme() — generates only the specified range', () => {
    const plugin = beerColorPlugin({ srmRange: false })
    const utilities: Record<string, any> = {}
    plugin(makeHelpers({ '--beer-ebc-start': '5', '--beer-ebc-end': '7' }, utilities) as any)
    expect(utilities['.ebc-5']).toBeDefined()
    expect(utilities['.ebc-7']).toBeDefined()
    expect(utilities['.ebc-4']).toBeUndefined()
    expect(utilities['.ebc-8']).toBeUndefined()
  })

  it('uses hardcoded defaults when theme() returns undefined', () => {
    const plugin = beerColorPlugin()
    const utilities: Record<string, any> = {}
    plugin(makeHelpers({}, utilities) as any)
    expect(utilities['.ebc-1']).toBeDefined()
    expect(utilities['.ebc-80']).toBeDefined()
    expect(utilities['.srm-1']).toBeDefined()
    expect(utilities['.srm-40']).toBeDefined()
  })
})

describe('beerColorPlugin — robust theme parsing', () => {
  const makeHelpers = (themeValues: Record<string, string>, out: Record<string, any>) => ({
    addUtilities: (u: any) => Object.assign(out, u),
    matchUtilities: () => {},
    theme: (key: string) => themeValues[key],
  })

  it('falls back to default lightPath on non-numeric theme value (no throw)', () => {
    const plugin = beerColorPlugin({ ebcRange: [20, 20], srmRange: false })
    const utilities: Record<string, any> = {}
    expect(() => plugin(makeHelpers({ '--beer-light-path': 'abc' }, utilities) as any)).not.toThrow()
    // default 5cm → not the 3cm reference value
    expect(utilities['.ebc-bg-20'].backgroundColor).toMatch(/^#[0-9a-f]{6}$/)
    expect(utilities['.ebc-bg-20'].backgroundColor).not.toBe('#d88900')
  })

  it('falls back to default lightPath on empty theme value (previously threw RangeError)', () => {
    const plugin = beerColorPlugin({ ebcRange: [20, 20], srmRange: false })
    const utilities: Record<string, any> = {}
    expect(() => plugin(makeHelpers({ '--beer-light-path': '' }, utilities) as any)).not.toThrow()
    expect(utilities['.ebc-bg-20']).toBeDefined()
  })

  it('falls back to default range on non-numeric theme value (still generates classes, not silent empty)', () => {
    const plugin = beerColorPlugin({ srmRange: false })
    const utilities: Record<string, any> = {}
    plugin(makeHelpers({ '--beer-ebc-end': 'auto' }, utilities) as any)
    expect(utilities['.ebc-1']).toBeDefined()
    expect(utilities['.ebc-80']).toBeDefined()
  })
})
