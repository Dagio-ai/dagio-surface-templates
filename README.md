# Dagio.ai Surface Templates

MIT-licensed native templates for Surface, published by **Dagio.ai**. This repository owns
template content and its catalogue. Surface Core owns validation, rendering, project execution,
Graph relations, permissions and Marketplace publication.

## Source layout

| File                                       | Responsibility                                                                                                         |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `catalogue.json`                           | Complete source index, publisher and licence.                                                                          |
| `surfaces/<collection>/<id>/template.json` | One versioned native Surface definition and its listing.                                                               |
| `spaces/<collection>/<id>/template.json`   | One versioned native Space Template and its listing. Workflow templates use the same contract with profile `workflow`. |
| `collections/*.json`                       | Curated groups and exact member references.                                                                            |
| `scripts/`                                 | Index verification, deterministic data packaging and release checks.                                                   |
| `test/`                                    | Catalogue completeness, integrity and packaging checks.                                                                |
| `docs/architecture.md`                     | Ownership, project Scope and proportional template selection.                                                          |
| `docs/marketplace.md`                      | Native qualification and Marketplace delivery.                                                                         |
| `LICENSE`                                  | MIT licence retained in source and distributable packages.                                                             |

## Runtime and build

Use Node 24 or newer, then `npm ci --ignore-scripts` and `npm run build`.
The package exports passive JSON through `./catalogue`, `./surfaces`, `./spaces` and
`./collections`. It contains no rendering engine, business writer or installation code.
Builds include every indexed template without catalogue-size caps. New collections may be
added without changing a product switch or generating every complexity/type combination.

Each source file contains the existing native artifact and Marketplace metadata. Author the
definition with the native Builder and capture/export path; preserve the assigned content
objects. The build assembles data and hashes bytes; it does not compile another template language.

The first collections cover project management and everyday work documentation. Operational
registers are empty Data Spaces with typed Fields. Plans, Scope and narrative evidence are
Surfaces. Templates are available to select; projects do not instantiate the whole collection.

## Validation

Run `npm run format:check`, `npm run lint`, `npm test`, `npm run verify` and `npm run build`.
These check this repository's index and packaging. Native template semantics are qualified by
Surface Core using `node scripts/templates/qualify.mjs --catalogue <repo>/dist/catalogue.json
--output <repo>/outputs/native-qualification.json`. Core uses its existing Surface/Space
validators and instantiation rules; no copy of the private Core implementation is distributed here.

`npm pack` requires a matching native qualification receipt and a clean committed tree.
The receipt identifies the actual Core commit and contract-source digest. It does not grant
publisher rights, installation consent or public Marketplace approval. The public CI validates
content/build integrity; native release qualification is performed by the Core owner.

Templates and their archives are MIT. Marketplace review and acceptance remain independent of
source publication. See [Marketplace delivery](docs/marketplace.md).
