#!/usr/bin/env node
/**
 * Regenerate all .mmd files in this repo from their OWM siblings.
 *
 * Walks every directory under the repo root, finds OWM-shaped source files
 * (those containing `component ` or `title `), converts each one via
 * owmToMermaid(), and writes a sibling `.mmd` next to the source. Existing
 * `.mmd` files are overwritten so a fresh run always matches the current
 * converter.
 *
 * Usage:
 *   node tools/regenerate.mjs              # from repo root
 *   node tools/regenerate.mjs --dry-run    # report what would change, write nothing
 *   node tools/regenerate.mjs --root PATH  # convert a different tree
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findMapFiles, owmToMermaid } from './convert.mjs';
import { tidyToFixpoint } from './tidy.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const rootIdx = args.indexOf('--root');
const root = rootIdx >= 0 && args[rootIdx + 1] ? resolve(args[rootIdx + 1]) : repoRoot;

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

console.log(`Scanning ${root}${dryRun ? '  (dry-run)' : ''}`);
const files = findMapFiles(root);
console.log(`Found ${files.length} OWM-shaped sources\n`);

let written = 0;
let unchanged = 0;
let failed = 0;

for (const f of files) {
  const rel = relative(root, f);
  try {
    const owm = readFileSync(f, 'utf8');
    if (owm.trim().length < 30) continue;
    // Tidy label offsets so labels don't overlap in the generated map.
    // Iterate to the fixpoint so the committed file is stable under `--check`.
    const mermaid = tidyToFixpoint(owmToMermaid(owm, f) + '\n').text;

    // Sibling .mmd path: strip any source extension, append .mmd
    const outPath = f.replace(/\.[^./]+$/, '') + '.mmd';

    let same = false;
    if (existsSync(outPath)) {
      try { same = readFileSync(outPath, 'utf8') === mermaid; } catch {}
    }

    if (same) {
      unchanged++;
      continue;
    }

    if (!dryRun) writeFileSync(outPath, mermaid);
    written++;
    console.log(`  ${GREEN}${dryRun ? 'WOULD-WRITE' : 'WRITE'}${RESET} ${rel}.mmd`);
  } catch (err) {
    failed++;
    console.log(`  ${RED}FAIL${RESET}  ${rel} ${DIM}— ${err.message}${RESET}`);
  }
}

console.log(
  `\n${written} ${dryRun ? 'would be written' : 'written'}, ` +
  `${unchanged} unchanged, ${failed} failed`
);
process.exit(failed > 0 ? 1 : 0);
