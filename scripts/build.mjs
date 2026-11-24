import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCatalogue, encode, digest } from './catalogue.mjs';
export async function build(root) {
  const { catalogue, sourceManifest, sourceHash } = await readCatalogue(root);
  const directory = resolve(root, 'dist');
  await mkdir(directory, { recursive: true });
  const surfaces = catalogue.templates
    .filter((t) => t.kind === 'surface-template')
    .map((t) => ({
      ...t.artifact,
      illustration: 'template-' + t.id,
      entries: t.presentation.headings,
      presentation: { glyph: t.presentation.glyph, tone: t.presentation.tone },
    }));
  const spaces = catalogue.templates.filter((t) => t.kind === 'space-template');
  const integration = catalogue.integrations.find((item) => item.id === 'surface-core');
  if (!integration) throw Error('Missing Surface Core integration selection');
  const builtin = integration.templates.map((ref) => surfaces.find((item) => item.id === ref.id));
  const values = {
    'catalogue.json': catalogue,
    'surfaces.json': surfaces,
    'builtin-surfaces.json': builtin,
    'spaces.json': spaces,
    'collections.json': catalogue.collections,
    'source-manifest.json': { schemaVersion: 1, sourceHash, files: sourceManifest },
  };
  for (const [file, value] of Object.entries(values))
    await writeFile(resolve(directory, file), encode(value));
  return {
    sourceHash,
    catalogueHash: digest(encode(catalogue)),
    surfaces: surfaces.length,
    spaces: spaces.length,
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url))
  console.log(JSON.stringify(await build(resolve(fileURLToPath(new URL('..', import.meta.url))))));
