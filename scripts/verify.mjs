import { fileURLToPath } from 'node:url';
import { readCatalogue } from './catalogue.mjs';
const { catalogue, sourceHash } = await readCatalogue(fileURLToPath(new URL('..', import.meta.url)));
console.log(
  `${catalogue.templates.length} templates, ${catalogue.collections.length} collections; source ${sourceHash}`,
);
