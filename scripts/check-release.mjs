import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { build } from './build.mjs';
const root = fileURLToPath(new URL('..', import.meta.url));
const current = await build(root);
const receipt = JSON.parse(await readFile(resolve(root, 'outputs/native-qualification.json')));
if (
  receipt.status !== 'passed' ||
  receipt.catalogueHash !== current.catalogueHash ||
  receipt.sourceHash !== current.sourceHash ||
  !/^[a-f0-9]{40}$/.test(receipt.coreCommit) ||
  !/^[a-f0-9]{64}$/.test(receipt.contractHash)
)
  throw Error('A current native Core qualification is required before packing.');
const clean = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
if (clean.status !== 0 || clean.stdout.trim())
  throw Error('Commit the qualified template sources before packing.');
console.log(
  `Native qualification retained for ${receipt.templates} templates. Marketplace admission remains separate.`,
);
