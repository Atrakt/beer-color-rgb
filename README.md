# beer-color-rgb

> Convert EBC (European Brewery Convention) or SRM (Standard Reference Method) beer color values to RGB hex codes with scientific accuracy.

![Version](https://img.shields.io/github/package-json/v/Atrakt/beer-color-rgb?color=blue)
![Build](https://img.shields.io/github/actions/workflow/status/Atrakt/beer-color-rgb/release.yml)
![Size](https://img.shields.io/github/repo-size/Atrakt/beer-color-rgb)
![Socket Badge](https://badge.socket.dev/npm/package/beer-color-rgb)
![npm](https://img.shields.io/npm/v/beer-color-rgb?color=CB3837&logo=npm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

## Table of Contents

- [What is it](#what-is-it)
- [Getting Started](#getting-started)
  - [Install](#install)
  - [Usage](#usage)
    - [As a library](#as-a-library)
    - [As a CLI](#as-a-cli)
    - [As a Tailwind CSS plugin](#as-a-tailwind-css-plugin)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
  - [API reference](#api-reference)
- [How it works](#how-it-works)
- [References](#references)
- [License](#license)

## What is it

`beer-color-rgb` takes an EBC or SRM value and converts it to a precise RGB color. It uses the **A.J. de Lange spectral model** — a scientifically validated method based on light transmission analysis of 99 real beers — producing colorimetrically accurate results suitable for brewing apps, color pickers, and design systems.

**[→ Live demo](https://atrakt.github.io/beer-color-rgb-demo)**

One package — use it as a **library**, a **CLI** (with CSS/JSON generation), or a **Tailwind CSS plugin**.

## Getting Started

**Prerequisites:**

[![npm](https://img.shields.io/badge/npm-9+-CB3837?logo=npm&logoColor=white)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Install

```bash
npm install beer-color-rgb
```

### Usage

#### As a library

```typescript
import { ebcToHex, ebcToRgb, ebcToRgbObject, srmToHex } from "beer-color-rgb";

// EBC
ebcToHex(20); // → "#b95900"
ebcToRgb(20); // → "rgb(185, 89, 0)"
ebcToRgbObject(20); // → { r: 185, g: 89, b: 0 }

// SRM
srmToHex(10); // → "#ba5b00"

// Custom optical path (cm)
ebcToHex(20, { lightPath: 3 }); // → "#d88900"
```

#### As a CLI

```bash
# Single EBC conversion
npx beer-color-rgb 20
# → #b95900

# Single SRM conversion
npx beer-color-rgb --srm 10
# → #ba5b00

# Batch CSS generation
npx beer-color-rgb generate --format css --unit ebc --output colors.css

# Batch JSON generation
npx beer-color-rgb generate --format json --unit srm --output colors.json

# Custom optical path
npx beer-color-rgb 20 --path 3
# → #d88900
```

#### As a Tailwind CSS plugin

**Tailwind CSS v4 (Recommended):**

```css
@import "tailwindcss";
@plugin "beer-color-rgb/plugin";

/* Optional: configure via @theme */
@theme {
  --beer-light-path: 3; /* optical path in cm, default 5 */
  --beer-ebc-start: 1; /* EBC range start, default 1 */
  --beer-ebc-end: 20; /* EBC range end, default 80 */
  --beer-srm-start: 1; /* SRM range start, default 1 */
  --beer-srm-end: 15; /* SRM range end, default 40 */
}
```

**Tailwind CSS v3 (Legacy):**

```typescript
// tailwind.config.ts
import { beerColorPlugin } from "beer-color-rgb/plugin";

export default {
  plugins: [beerColorPlugin()],
};
```

This generates utility classes for EBC 1–80 and SRM 1–40:

```html
<div class="ebc-bg-20">...</div>
<div class="srm-bg-10">...</div>

<!-- Decimal values supported, though uncommon in practice -->
<div class="ebc-bg-[35.5]">...</div>
```

Plugin options (v3 JS config — all options available):

```typescript
beerColorPlugin({
  ebcRange: [1, 80], // or false to disable
  srmRange: [1, 40], // or false to disable
  lightPath: 5, // optical path in cm (default: 5)
});
```

> **Note:** Disabling a range entirely (`false`) is v3/JS-only. In v4, use `@theme` variables to restrict the range.

## Project Structure

```
beer-color-rgb/
├── src/
│   ├── convert.ts          # Core conversion logic (A.J. de Lange spectral model)
│   ├── index.ts            # Public API exports
│   ├── cli.ts              # Command-line interface
│   └── plugin.ts           # Tailwind CSS plugin
├── tests/
│   ├── convert.test.ts
│   ├── index.test.ts
│   └── plugin.test.ts
├── package.json
├── tsconfig.json
└── CHANGELOG.md
```

## Configuration

### Environment variables

None required. The conversion uses fixed CIE 1931 colorimetric data and D65 illuminant (standard daylight).

### API reference

**EBC functions**

```typescript
ebcToHex(ebc: number, options?: ColorOptions): string
// → "#b95900"

ebcToRgb(ebc: number, options?: ColorOptions): string
// → "rgb(185, 89, 0)"

ebcToRgbObject(ebc: number, options?: ColorOptions): { r: number; g: number; b: number }
// → { r: 185, g: 89, b: 0 }

ebcToRgbArray(ebc: number, options?: ColorOptions): [number, number, number]
// → [185, 89, 0]
```

**SRM functions** (SRM × 1.97 = EBC internally)

```typescript
srmToHex(srm: number, options?: ColorOptions): string
srmToRgb(srm: number, options?: ColorOptions): string
srmToRgbObject(srm: number, options?: ColorOptions): { r: number; g: number; b: number }
srmToRgbArray(srm: number, options?: ColorOptions): [number, number, number]
```

**ColorOptions**

```typescript
type ColorOptions = {
  lightPath?: number; // Optical path in cm (default: 5.0)
};
```

| `lightPath`     | Use case                                         |
| --------------- | ------------------------------------------------ |
| `5.0` (default) | BJCP standard — typical glass viewed in daylight |
| `3.0`           | Aesthetic middle ground — richer apparent color  |
| `1.27`          | ASBC/EBC laboratory measurement standard         |

## How it works

The A.J. de Lange spectral model reconstructs the light transmission spectrum for a given EBC value, then converts the result to sRGB using CIE 1931 colorimetry with D65 (6500K daylight) illumination.

**Pipeline:**

```
EBC → Spectral transmission T(λ) → XYZ tristimulus → sRGB linear → sRGB gamma correction → #RRGGBB
```

This approach is more accurate than polynomial or exponential approximations, especially for pale beers (EBC 1–20) and dark beers (EBC 50+).

## References

- **A.J. de Lange** — _"Color"_ in Bamforth's [Brewing Materials and Processes](https://books.google.fr/books?id=52OdBgAAQBAJ&pg=PA199&lpg=PA199&dq=A.J.%20deLange%20Brewing%20Materials%20and%20Processes&lr&hl=fr#v=onepage&q&f=false) (2016) — double-exponential Beer-Lambert model fitted on 99 real beers
- **Thomas Ascher / olfarve** — [github.com/aschet/olfarve](https://github.com/aschet/olfarve) — reference implementation in Python, JS, C++, Go and more (MIT License)
- **CIE 1931** — [CIE 1931 color space](https://en.wikipedia.org/wiki/CIE_1931_color_space) — 2° standard observer color matching functions (x̄, ȳ, z̄) and D65 illuminant spectral data
- **IEC 61966-2-1 / sRGB** — [sRGB standard](https://www.color.org/chardata/rgb/srgb.xalter) — XYZ→linear sRGB matrix and gamma transfer function
- **BJCP Color Guide** — [bjcp.org/education-training/education-resources/color-guide](https://www.bjcp.org/education-training/education-resources/color-guide/) — defines the 5 cm optical path as the standard for beer color perception

## License

MIT — see [LICENSE](LICENSE) file.
