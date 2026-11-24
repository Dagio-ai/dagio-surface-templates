import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, cp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCatalogue, encode, templateKey } from '../scripts/catalogue.mjs';
import { build } from '../scripts/build.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
test('builds the complete catalogue deterministically and keeps MIT/Dagio.ai provenance', async () => {
  const first = await build(root),
    second = await build(root);
  assert.deepEqual(first, second);
  const { catalogue } = await readCatalogue(root);
  assert.ok(catalogue.templates.some((t) => t.id === 'project-scope'));
  assert.ok(catalogue.templates.some((t) => t.id === 'risks' && t.kind === 'space-template'));
  assert.equal(new Set(catalogue.templates.map(templateKey)).size, catalogue.templates.length);
  const distributed = JSON.parse(await readFile(join(root, 'dist/catalogue.json')));
  assert.deepEqual(distributed, catalogue);
});
test('rejects omissions, duplicate identities, escaping paths and mismatched publication licences', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'dagio-template-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const path of ['catalogue.json', 'collections', 'surfaces', 'spaces', 'integrations', 'LICENSE'])
    await cp(join(root, path), join(directory, path), { recursive: true });
  await readCatalogue(directory);
  const manifest = JSON.parse(await readFile(join(directory, 'catalogue.json')));
  for (const altered of [
    { ...manifest, templates: [...manifest.templates, manifest.templates[0]] },
    { ...manifest, templates: ['../outside.json'] },
    { ...manifest, templates: manifest.templates.slice(1) },
  ]) {
    await writeFile(join(directory, 'catalogue.json'), encode(altered));
    await assert.rejects(readCatalogue(directory));
  }
  await writeFile(join(directory, 'catalogue.json'), encode(manifest));
  const path = join(directory, manifest.templates[0]),
    item = JSON.parse(await readFile(path));
  item.metadata.license = 'Proprietary';
  await writeFile(path, encode(item));
  await assert.rejects(readCatalogue(directory), /Listing identity/);
});
