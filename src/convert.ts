// Based on olfarve by Thomas Ascher <thomas.ascher@gmx.at>
// Copyright 2022 Thomas Ascher — MIT License
// https://github.com/aschet/olfarve
//
// Algorithm: A.J. de Lange, "Color," in Brewing Materials and Processes, Elsevier, 2016.
// CIE data: CIE 1931 2° observer + D65 illuminant — https://cie.co.at

// CIE 1931 2° standard observer + D65 illuminant data
// 81 entries, λ = 380–780 nm, 5 nm steps
// Format: [x_bar, y_bar, z_bar, D65]
const CIE_DATA: readonly [number, number, number, number][] = [
  [0.001368, 0.000039, 0.006450, 49.9755],
  [0.002236, 0.000064, 0.010550, 52.3118],
  [0.004243, 0.000120, 0.020050, 54.6482],
  [0.007650, 0.000217, 0.036210, 68.7015],
  [0.014310, 0.000396, 0.067850, 82.7549],
  [0.023190, 0.000640, 0.110200, 87.1204],
  [0.043510, 0.001210, 0.207400, 91.4860],
  [0.077630, 0.002180, 0.371300, 92.4589],
  [0.134380, 0.004000, 0.645600, 93.4318],
  [0.214770, 0.007300, 1.039050, 90.0570],
  [0.283900, 0.011600, 1.385600, 86.6823],
  [0.328500, 0.016840, 1.622960, 95.7736],
  [0.348280, 0.023000, 1.747060, 104.865],
  [0.348060, 0.029800, 1.782600, 110.936],
  [0.336200, 0.038000, 1.772110, 117.008],
  [0.318700, 0.048000, 1.744100, 117.410],
  [0.290800, 0.060000, 1.669200, 117.812],
  [0.251100, 0.073900, 1.528100, 116.336],
  [0.195360, 0.090980, 1.287640, 114.861],
  [0.142100, 0.112600, 1.041900, 115.392],
  [0.095640, 0.139020, 0.812950, 115.923],
  [0.057950, 0.169300, 0.616200, 112.367],
  [0.032010, 0.208020, 0.465180, 108.811],
  [0.014700, 0.258600, 0.353300, 109.082],
  [0.004900, 0.323000, 0.272000, 109.354],
  [0.002400, 0.407300, 0.212300, 108.578],
  [0.009300, 0.503000, 0.158200, 107.802],
  [0.029100, 0.608200, 0.111700, 106.296],
  [0.063270, 0.710000, 0.078250, 104.790],
  [0.109600, 0.793200, 0.057250, 106.239],
  [0.165500, 0.862000, 0.042160, 107.689],
  [0.225750, 0.914850, 0.029840, 106.047],
  [0.290400, 0.954000, 0.020300, 104.405],
  [0.359700, 0.980300, 0.013400, 104.225],
  [0.433450, 0.994950, 0.008750, 104.046],
  [0.512050, 1.000000, 0.005750, 102.023],
  [0.594500, 0.995000, 0.003900, 100.000],
  [0.678400, 0.978600, 0.002750, 98.1671],
  [0.762100, 0.952000, 0.002100, 96.3342],
  [0.842500, 0.915400, 0.001800, 96.0611],
  [0.916300, 0.870000, 0.001650, 95.7880],
  [0.978600, 0.816300, 0.001400, 92.2368],
  [1.026300, 0.757000, 0.001100, 88.6856],
  [1.056700, 0.694900, 0.001000, 89.3459],
  [1.062200, 0.631000, 0.000800, 90.0062],
  [1.045600, 0.566800, 0.000600, 89.8026],
  [1.002600, 0.503000, 0.000340, 89.5991],
  [0.938400, 0.441200, 0.000240, 88.6489],
  [0.854450, 0.381000, 0.000190, 87.6987],
  [0.751400, 0.321000, 0.000100, 85.4936],
  [0.642400, 0.265000, 0.000050, 83.2886],
  [0.541900, 0.217000, 0.000030, 83.4939],
  [0.447900, 0.175000, 0.000020, 83.6992],
  [0.360800, 0.138200, 0.000010, 81.8630],
  [0.283500, 0.107000, 0.000000, 80.0268],
  [0.218700, 0.081600, 0.000000, 80.1207],
  [0.164900, 0.061000, 0.000000, 80.2146],
  [0.121200, 0.044580, 0.000000, 81.2462],
  [0.087400, 0.032000, 0.000000, 82.2778],
  [0.063600, 0.023200, 0.000000, 80.2810],
  [0.046770, 0.017000, 0.000000, 78.2842],
  [0.032900, 0.011920, 0.000000, 74.0027],
  [0.022700, 0.008210, 0.000000, 69.7213],
  [0.015840, 0.005723, 0.000000, 70.6652],
  [0.011359, 0.004102, 0.000000, 71.6091],
  [0.008111, 0.002929, 0.000000, 72.9790],
  [0.005790, 0.002091, 0.000000, 74.3490],
  [0.004109, 0.001484, 0.000000, 67.9765],
  [0.002899, 0.001047, 0.000000, 61.6040],
  [0.002049, 0.000740, 0.000000, 65.7448],
  [0.001440, 0.000520, 0.000000, 69.8856],
  [0.001000, 0.000361, 0.000000, 72.4863],
  [0.000690, 0.000249, 0.000000, 75.0870],
  [0.000476, 0.000172, 0.000000, 69.3398],
  [0.000332, 0.000120, 0.000000, 63.5927],
  [0.000235, 0.000085, 0.000000, 55.0054],
  [0.000166, 0.000060, 0.000000, 46.4182],
  [0.000117, 0.000042, 0.000000, 56.6118],
  [0.000083, 0.000030, 0.000000, 66.8054],
  [0.000059, 0.000021, 0.000000, 65.0941],
  [0.000042, 0.000015, 0.000000, 63.3828],
]

// Normalization constant K = 1 / Σ(y_bar × D65)
const _K: number = 1.0 / CIE_DATA.reduce((sum, [, y, , d65]) => sum + y * d65, 0)

// sRGB gamma correction
function _gamma(t: number): number {
  return t <= 0.0031308
    ? 12.92 * t
    : 1.055 * Math.pow(t, 1 / 2.4) - 0.055
}

/**
 * Converts an EBC value to [R, G, B] using the A.J. de Lange spectral model.
 * @param ebc - EBC value (1–80+, float accepted)
 * @param pathCm - Optical path length in cm. No default here — caller must supply a value.
 *   The public API default (5.0 cm) is defined in index.ts as the single source of truth.
 * @returns [R, G, B] — integers in [0, 255]
 */
export function ebcToRgbArray(ebc: number, pathCm: number): [number, number, number] {
  if (!Number.isFinite(ebc) || ebc < 0) {
    throw new RangeError(`EBC value must be a non-negative finite number, got ${ebc}`)
  }
  if (!Number.isFinite(pathCm) || pathCm <= 0) {
    throw new RangeError(`pathCm must be a positive finite number, got ${pathCm}`)
  }

  // EBC/25.0 ≈ EBC / (1.97 × 12.7) — converts EBC to the SRM/12.7 ratio used in the A.J. de Lange formula
  const a430 = ebc / 25.0

  let X = 0, Y = 0, Z = 0
  for (let i = 0; i < CIE_DATA.length; i++) {
    const lam = 380 + (i * 5)
    const [xb, yb, zb, d65] = CIE_DATA[i]
    
    // Spectral coefficients: olfarve implementation (github.com/aschet/olfarve)
    // Note: A.J. de Lange 2008 paper (J.Am.Soc.Brew.Chem 66(3)) uses different coefficients:
    // 0.018747/13.374 + 0.98226/80.514. Both are scientifically valid.
    // Comparison at path 3cm: EBC2=#fcf1d0(same), EBC5=#f7dc98/f7dd98, EBC10=#eebc53/efbd53,
    // EBC20=#d88900/da8b00, EBC40=#ab4800/ae4a00, EBC80=#690600/6d0800 (olfarve/A.J. de Lange 2008)
    const exponent = -a430 * pathCm * (
      0.02465 * Math.exp(-(lam - 430.0) / 17.591) +
      0.97535 * Math.exp(-(lam - 430.0) / 82.122)
    )
    const T = Math.pow(10.0, exponent)
    
    X += d65 * T * xb
    Y += d65 * T * yb
    Z += d65 * T * zb
  }

  X *= _K; Y *= _K; Z *= _K

  // XYZ to linear sRGB matrix (D65 adapted)
  const rLin =  3.2406255 * X + -1.537208  * Y + -0.4986286 * Z
  const gLin = -0.9689307 * X +  1.8757561 * Y +  0.0415175 * Z
  const bLin =  0.0557101 * X + -0.2040211 * Y +  1.0569959 * Z

  // Clamp to [0, 1] before gamma — linear channels can be slightly negative (e.g. blue on pale beers)
  const r = Math.round(Math.min(255, _gamma(Math.max(0, rLin)) * 255))
  const g = Math.round(Math.min(255, _gamma(Math.max(0, gLin)) * 255))
  const b = Math.round(Math.min(255, _gamma(Math.max(0, bLin)) * 255))

  return [r, g, b]
}

/**
 * Formats [R, G, B] as a hex string "#rrggbb".
 */
export function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}
