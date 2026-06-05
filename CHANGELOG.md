# Changelog

All notable changes to this project will be documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.3.5] - 2026-06-05

### Fixed

- CLI: invalid `--path`, malformed `--range`, and non-numeric values now print a clear error and exit cleanly instead of leaking a stack trace.
- CLI: file write errors (`--output`) are reported with a readable message.
- Tailwind plugin: non-numeric or empty `@theme` values (e.g. `--beer-light-path`, `--beer-ebc-end`) now fall back to defaults instead of breaking the build or silently generating zero classes.
- `package.json`: pinned `devDependencies` to exact versions for reproducible builds.

### Added

- Test coverage for the CLI core (`parseNumber`, `parseRange`, CSS/JSON generation) and plugin theme fallbacks.

### Changed

- Extracted CLI logic into a testable `cli-core` module; `cli.ts` is now a thin entry point.

## [0.3.4] - 2026-05-29

### Changed

- Bumped `@types/node`, `tsx`, `typescript`, and `vitest`.
- Fixed TypeScript 6.0 build compatibilities.

## [0.3.3] - 2026-05-07

### Fixed

- Tailwind v4: plugin now correctly generates utilities when loaded via `@plugin` (previous `export default beerColorPlugin` was the factory — v4 ignored the returned function, producing zero classes).

### Added

- Tailwind v4: `lightPath`, `ebcRange`, and `srmRange` are now configurable via `@theme` CSS variables (`--beer-light-path`, `--beer-ebc-start`, `--beer-ebc-end`, `--beer-srm-start`, `--beer-srm-end`).

## [0.3.2] - 2026-04-26

### Added

- GitHub Actions workflow for automated releases with npm provenance (`--provenance`).

### Changed

- Package renamed from `beer-color-css` to `beer-color-rgb`.
- `src/convert.ts`: added attribution header for olfarve (Thomas Ascher, MIT) and A.J. de Lange algorithm.
- `package.json`: pinned devDependencies to exact versions.
- `package.json`: `author` now includes email field.
- `package.json`: added `publishConfig` with `access: public` and `provenance: true`.
- `package.json`: added keyword `A.J. de Lange`.
- README: `lightPath: 3.0` description updated to "Aesthetic middle ground — richer apparent color".
- README: decimal arbitrary values clarified as supported though uncommon in practice.
- README: all badges are now clickable links.
- README: added npm version badge.

## [0.3.1] - 2026-04-24

### Changed

- README: fixed Table of Contents (removed self-referencing entries).
- README: updated project structure tree (added `tests/`, aligned with `.gitignore`).
- README: added live demo link (https://atrakt.github.io/beer-color-rgb-demo).
- README: added npm version badge.

## [0.3.0] - 2026-04-24

### Notes

- First version published on GitHub (originally under package name `beer-color-css`, renamed to `beer-color-rgb` in v0.3.2).

### Added

- SRM support: `srmToHex()`, `srmToRgb()`, `srmToRgbObject()`, `srmToRgbArray()` — converts SRM values using the same A.J. de Lange spectral model.
- Tailwind CSS plugin: `beerColorPlugin()` — generates `ebc-bg-{n}` and `srm-bg-{n}` utility classes with arbitrary value support.
- Extended public API: `ebcToHex()`, `ebcToRgbObject()`, `ebcToRgbArray()` exported alongside `ebcToRgb()`.
- `engines` field in `package.json`: requires Node.js ≥ 18.

### Fixed

- Core: `pathCm` parameter now validated — throws `RangeError` on non-positive or non-finite values.
- CLI: `parseRange` validates both bounds (`Number.isFinite`, `a ≤ b`) before iterating; single-value handler uses `Number.isFinite` consistently.
- Tailwind plugin: arbitrary value handler (`ebc-bg-[n]`, `srm-bg-[n]`) guards against non-finite `parseFloat` results.
- Docstring in `convert.ts`: corrected default path reference (was 3.0, is 5.0).

### Changed

- Author name uniformized to "A.J. de Lange" across all source files, comments, and documentation.
- `prettierrc`: `printWidth` reduced from 400 to 120.
- `tsconfig.json`: removed dead `"demo"` entry from `exclude`.

## [0.2.0] - 2026-04-13

### Added

- `ebcToRgb()` public API with `hex` (default), `rgb`, and `object` output formats.
- A.J. de Lange spectral model: Beer-Lambert double-exponential, CIE 1931 2° observer, D65 illuminant, sRGB gamma (IEC 61966-2-1 matrix at 7-decimal precision).
- Input validation: `RangeError` on negative or non-finite EBC values.
- Pre-gamma clamp on linear sRGB channels (matches Python source behavior).
- CLI: single-value conversion and batch CSS/JSON generation with configurable EBC range.
- Unit tests with exact RGB values pinned to the reference Python output.
- `tsconfig.test.json` for type-checking test files independently of the build.

## [0.1.0] - 2026-04-12

### Added

- Initial project setup: `package.json`, `tsconfig.json`, empty source stubs.
- Build pipeline: tsup (ESM + CJS + TypeScript declarations), vitest, tsx.
- `.gitignore` with `node_modules/`, `dist/`, `*.log`, `coverage/`.

[Unreleased]: https://github.com/Atrakt/beer-color-rgb/compare/v0.3.2...HEAD
[0.3.2]: https://github.com/Atrakt/beer-color-rgb/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/Atrakt/beer-color-rgb/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/Atrakt/beer-color-rgb/releases/tag/v0.3.0
