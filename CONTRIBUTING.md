# Contributing templates

Read `AGENTS.md`, the README and the architecture first. Add one directory per template under
`surfaces/<collection>/<id>/` or `spaces/<collection>/<id>/`, then register its exact path in
`catalogue.json` and its kind/id in one collection. Every source must be indexed and every
template belongs to one primary collection; supplementary recommendations may reference it.

Use the native Builder/capture contracts. Preserve native object identities in authored source;
the runtime's duplication/instantiation owner creates instance identities. Supply clear purpose,
instructions, typed Fields and useful native views without example personal data. Unknown values
must remain unset. Keep repeated operational entries in Data Spaces, not narrative placeholders.

Match artifact kind, semantic version, publisher Dagio.ai, MIT licence and native Marketplace
metadata. Avoid fixed-size catalogue tests or application code keyed on particular business ids.
Add new subject areas as collections. Include selection guidance and evidence needed to use the
template responsibly; a large template count alone does not make the catalogue useful.

Run the repository checks and qualify through Core before release. Include the MIT notice in
redistributed source and archives. Never overwrite a published version with changed bytes.
