# Tools

Standalone Node.js tooling for regenerating the `.mmd` files in this repo from their OWM siblings. No dependencies — pure stdlib.

## Files

- **`convert.mjs`** — the OWM → Mermaid `wardley-beta` converter. Exports `owmToMermaid(owmContent, filename)` and `findMapFiles(dir)`. Safe to import directly from your own scripts.
- **`regenerate.mjs`** — walks the repo root, converts every OWM-shaped source, and writes a sibling `.mmd` next to it.

## Regenerating every `.mmd` in the repo

```bash
# From the repo root
node tools/regenerate.mjs

# Preview without writing anything
node tools/regenerate.mjs --dry-run

# Convert a different tree (e.g., a fresh clone of the upstream repo)
node tools/regenerate.mjs --root /path/to/WARDLEY-MAP-REPOSITORY
```

The script skips any file ending in `.mmd` (its own output), so repeated runs are idempotent.

## Converting a single OWM file

```javascript
import { readFileSync, writeFileSync } from 'node:fs';
import { owmToMermaid } from './tools/convert.mjs';

const owm = readFileSync('path/to/map.owm', 'utf8');
const mermaid = owmToMermaid(owm, 'path/to/map.owm');
writeFileSync('path/to/map.mmd', mermaid + '\n');
```

## Fidelity and validation

These conversions were validated in [`tractorjuice/arc-kit`](https://github.com/tractorjuice/arc-kit/tree/main/tests/mermaid-wardley) and against the current generated files in this repo:

- **Mermaid 11.15.0 smoke test** — parses and renders every generated `.mmd` file with the real Mermaid parser/renderer. Result: 147 / 147 maps parse and render.
- **`test-fidelity.mjs`** — parses each source and its conversion with the same grammar and compares. Result: 100 % component / anchor / link retention, `|Δε|` = 0 exactly across 4,905 matched pairs. The mean `|Δν|` of 0.008 is grammar-level (pipeline children in `wardley-beta` inherit parent visibility).

Mermaid 11.15.0 includes Wardley fixes for unnecessary text sanitization and unquoted hyphenated component names. The converter still quotes names conservatively so regenerated output remains usable on Mermaid 11.14.0+.

## Requirements

Node.js 18+ (for stable ESM + top-level `await`). No npm dependencies.
