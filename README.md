# Wardley Maps — Mermaid Edition

A mirror of [`swardley/WARDLEY-MAP-REPOSITORY`](https://github.com/swardley/WARDLEY-MAP-REPOSITORY) with each map also rendered as Mermaid `wardley-beta` (`.mmd`) alongside the original OnlineWardleyMaps (`.owm`-format) source.

Every source file is kept verbatim; each one has a sibling `.mmd` in the same directory that will render directly on GitHub, in VS Code, on Mermaid Live Editor, or anywhere Mermaid 11.14.0+ is available.

## What's here

- **147 Wardley maps** converted from the source repo
- Directory structure mirrors the upstream — `agriculture/`, `ai/`, `defence/`, `healthcare/`, etc.
- Every conversion is lossless for components, anchors, links, and evolution coordinates (see [fidelity notes](#conversion-fidelity))
- **All 147 `.mmd` files parse cleanly** under Mermaid 11.14.0+

## Rendering a map

GitHub renders Mermaid inside a fenced code block. To view any map, either:

- Open the `.mmd` file in [Mermaid Live Editor](https://mermaid.live/) and paste in the contents, or
- Wrap the contents in ` ```mermaid ... ``` ` in any Markdown file on GitHub

Example:

````markdown
```mermaid
wardley-beta
title AI Trust, June 2023
...
```
````

`wardley-beta` was added to Mermaid in [v11.14.0](https://github.com/mermaid-js/mermaid/releases/tag/mermaid%4011.14.0) (2026-04-01) via [PR #7147](https://github.com/mermaid-js/mermaid/pull/7147).

## Conversion fidelity

Across all 147 maps (4,905 components, 5,172 links):

| Metric | Result |
|--------|--------|
| Component retention | **100 %** (4,905 / 4,905) |
| Anchor retention | **100 %** (43 / 43) |
| Link retention | **100 %** (5,172 / 5,172) |
| Evolution coordinate drift `\|Δε\|` | **0.0 exactly** across all matched pairs |
| Visibility drift `\|Δν\|` (mean) | 0.008 |

The small `|Δν|` is grammar-level, not a conversion bug: `wardley-beta`'s pipeline-block syntax uses 1-D `[evo]` for children, forcing them to inherit parent visibility. A handful of source maps place children at slightly different visibility to their parent; that offset cannot be expressed in `wardley-beta` pipelines.

## Deviations from upstream

This fork is a faithful mirror with one exception: **`manufacturing/manufacturing - automation`** has a single-character fix — `component 1 [0.55. 0.18]` → `[0.55, 0.18]` (a period was a comma in the upstream source). The typo would otherwise block rendering. No other source edits.

## Converter

The OWM → Mermaid `wardley-beta` converter ships in this repo under [`tools/`](./tools/):

```bash
# Rebuild every .mmd file from its OWM sibling
node tools/regenerate.mjs

# Preview without writing
node tools/regenerate.mjs --dry-run

# Convert a different tree (e.g., a fresh clone of the upstream source)
node tools/regenerate.mjs --root /path/to/WARDLEY-MAP-REPOSITORY
```

Pure stdlib, no npm dependencies. Node.js 18+.

The converter is maintained upstream at [`tractorjuice/arc-kit/tests/mermaid-wardley/`](https://github.com/tractorjuice/arc-kit/tree/main/tests/mermaid-wardley), which also hosts the parser-validation (`test-real-maps.mjs`) and conversion-fidelity (`test-fidelity.mjs`) suites.

## Attribution

All maps are the work of **Simon Wardley** ([@swardley](https://github.com/swardley)) and contributors to the [2022 research project](https://github.com/swardley/WARDLEY-MAP-REPOSITORY). The OnlineWardleyMaps tool that produced the source files is by **Damon Skelhorn** ([@damonsk](https://github.com/damonsk)), [`damonsk/onlinewardleymaps`](https://github.com/damonsk/onlinewardleymaps).

See `SOURCE-README.md` for the upstream repository's README.

## Licence

- **Map content** (all `.owm`, `.mmd`, and equivalent map files) — [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/), matching the upstream declaration. See `LICENSE`.
- **Upstream `LICENSE`** (GPL v3) preserved as `LICENSE-upstream-GPLv3` for completeness.

Contributions to this fork are accepted under the same CC-BY-SA 4.0 terms.
