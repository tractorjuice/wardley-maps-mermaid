import test from 'node:test';
import assert from 'node:assert/strict';
import { tidyMap } from './tidy.mjs';

test('adds label offsets to untuned components', () => {
  const src = [
    'wardley-beta',
    'size [900, 600]',
    'component Alpha Component [0.55, 0.50]',
    'component Beta Component [0.55, 0.50]',
    '',
  ].join('\n');
  const { text, changed } = tidyMap(src);
  assert.match(text, /component Alpha Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.match(text, /component Beta Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.ok(changed >= 1, 'expected at least one line changed');
});

test('is idempotent — tidying a tidied map changes nothing further', () => {
  const src = [
    'wardley-beta',
    'size [900, 600]',
    'component Alpha Component [0.55, 0.50]',
    'component Beta Component [0.40, 0.65]',
    '',
  ].join('\n');
  const once = tidyMap(src).text;
  const twice = tidyMap(once).text;
  assert.equal(twice, once);
});

test('keeps a collision-free authored label unchanged', () => {
  const src = [
    'wardley-beta',
    'size [900, 600]',
    'component Lonely [0.50, 0.50] label [40, -20]',
    '',
  ].join('\n');
  const { text } = tidyMap(src);
  assert.match(text, /component Lonely \[0\.50, 0\.50\] label \[40, -20\]/);
});

test('leaves non-component lines verbatim', () => {
  const src = [
    'wardley-beta',
    'title My Map',
    'size [900, 600]',
    'component Solo [0.50, 0.50]',
    '',
  ].join('\n');
  const { text } = tidyMap(src);
  assert.match(text, /^wardley-beta$/m);
  assert.match(text, /^title My Map$/m);
  assert.match(text, /^size \[900, 600\]$/m);
});
