import { readFile, realpath, lstat, readdir } from 'node:fs/promises';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { createHash } from 'node:crypto';

export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const encode = (value) => JSON.stringify(value, null, 2) + '\n';
export const templateKey = ({ kind, id }) => `${kind}:${id}`;
export async function readCatalogue(root) {
  root = await realpath(root);
  const files = new Map();
  async function read(path) {
    if (
      typeof path !== 'string' ||
      isAbsolute(path) ||
      path.includes('\\') ||
      path.split('/').some((p) => !p || p === '.' || p === '..')
    )
      throw Error('Invalid catalogue path');
    const absolute = await realpath(resolve(root, path));
    const local = relative(root, absolute);
    if (
      local === '..' ||
      local.startsWith('..' + sep) ||
      isAbsolute(local) ||
      !(await lstat(absolute)).isFile()
    )
      throw Error('Catalogue path escapes its repository');
    const bytes = await readFile(absolute);
    files.set(path, digest(bytes));
    return JSON.parse(bytes);
  }
  const manifest = await read('catalogue.json');
  if (
    manifest.schemaVersion !== 1 ||
    manifest.publisher !== 'Dagio.ai' ||
    manifest.license !== 'MIT' ||
    manifest.repository !== 'https://github.com/Dagio-ai/dagio-surface-templates'
  )
    throw Error('Invalid catalogue identity');
  for (const paths of [manifest.templates, manifest.collections])
    if (!Array.isArray(paths) || new Set(paths).size !== paths.length)
      throw Error('Duplicate or invalid catalogue paths');
  const templates = [],
    identities = new Set();
  for (const path of manifest.templates) {
    const item = await read(path);
    if (!/^[a-z][a-z0-9-]{0,59}$/.test(item.id) || !/^\d+\.\d+\.\d+$/.test(item.version))
      throw Error('Invalid template identity');
    if (
      !['surface-template', 'space-template'].includes(item.kind) ||
      item.publisher !== manifest.publisher ||
      item.license !== 'MIT'
    )
      throw Error('Invalid template kind, publisher or licence');
    const prefix = item.kind === 'surface-template' ? 'surfaces' : 'spaces';
    if (path !== `${prefix}/${item.collection}/${item.id}/template.json`)
      throw Error('Template path must match its identity');
    const key = templateKey(item);
    if (identities.has(key)) throw Error('Duplicate template identity');
    identities.add(key);
    const metadata = item.metadata;
    if (
      metadata?.kind !== item.kind ||
      metadata.license !== 'MIT' ||
      metadata.publisherLabel !== 'Dagio.ai' ||
      (metadata.templateVersion ?? metadata.modelVersion) !== item.version
    )
      throw Error('Listing identity does not match its template');
    if (!item.artifact || !metadata.title || !metadata.description)
      throw Error('Missing native artifact or listing');
    templates.push(item);
  }
  const collections = [],
    grouped = new Set(),
    collectionIds = new Set();
  for (const path of manifest.collections) {
    const collection = await read(path);
    if (
      path !== `collections/${collection.id}.json` ||
      collectionIds.has(collection.id) ||
      !collection.title ||
      !Array.isArray(collection.templates)
    )
      throw Error('Invalid collection');
    collectionIds.add(collection.id);
    for (const ref of collection.templates) {
      const key = templateKey(ref),
        item = templates.find((item) => templateKey(item) === key);
      if (!item || item.collection !== collection.id || grouped.has(key))
        throw Error('Invalid or duplicate collection member');
      grouped.add(key);
    }
    collections.push(collection);
  }
  if (grouped.size !== templates.length) throw Error('Every template needs one collection');
  // Reject authored JSON omitted from the manifest instead of silently dropping new templates.
  async function walk(directory) {
    const values = [];
    for (const entry of await readdir(resolve(root, directory), { withFileTypes: true })) {
      if (entry.isSymbolicLink()) throw Error('Symlinked catalogue content is not admitted');
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) values.push(...(await walk(path)));
      else if (entry.isFile() && entry.name.endsWith('.json')) values.push(path);
    }
    return values;
  }
  for (const directory of ['surfaces', 'spaces', 'collections'])
    for (const path of await walk(directory))
      if (!files.has(path)) throw Error('Unregistered catalogue file: ' + path);
  const licence = await readFile(resolve(root, 'LICENSE'));
  if (
    !licence.toString().includes('Copyright (c) 2026 Dagio.ai') ||
    !licence.toString().startsWith('MIT License')
  )
    throw Error('The MIT licence must accompany the catalogue');
  files.set('LICENSE', digest(licence));
  const sourceManifest = Object.fromEntries([...files].sort(([a], [b]) => a.localeCompare(b)));
  return {
    catalogue: { ...manifest, templates, collections },
    sourceManifest,
    sourceHash: digest(encode(sourceManifest)),
  };
}
