# Template ownership and project composition

## Native definitions, one source owner

This repository owns reusable native content, listing metadata, independent semantic versions,
collections and selection guidance. Core owns every runtime contract, renderer, writer, query,
identity/revision rule, authorization check and Marketplace service. Keep those authorities intact.
An exported template is a starting definition, not a shared live document or a second work engine.

Surface templates initialize native Surfaces. Space templates initialize independent Spaces and
their saved Data Views. Workflow templates are native Space templates with profile `workflow`;
they need no new Marketplace artifact kind. Collections reference these definitions and contain
no user records, private resources or installation state.

## Project Scope and Flow

The agreed product target places Scope directly on the Workflow/Space, with its own native
Surface identity, history and permanent navigation entry. An initialization step can prepare
or validate it. Scope remains available when steps are imported or the execution model changes.
It records outcomes, inclusions/exclusions, deliverables, acceptance criteria, constraints,
assumptions, decision rights and approved changes. A proposal is not an approved baseline.

This ownership is a runtime integration requirement, not a claim that a JSON template alone
implements project navigation or scope-change control. Keep the initial conversation request
in the conversation, use the Space description for a short summary, and keep project boundaries
in the same Scope Surface. The Working Guide links it without owning another scope baseline.

## Proportionate selection

Templates are tools to select according to scope, uncertainty, impact, stakeholders, constraints
and team size. A birdhouse may need only Scope, a few steps and acceptance checks. A large
project may need governance, responsibilities, registers, baselines and financial forecasts.
Add these resources when useful during the project; do not create empty management machinery
or infer complexity from the number of steps alone.

The catalogue can offer small/medium/large starting Workflows alongside project types such as
content, software, events and physical delivery. Avoid an exhaustive Cartesian product of variants.
After scope clarification, the Assistant recommends a fit and explains the useful controls.
For an existing project, native import must preview and adapt its Workmap/Fields/views while
preserving Scope, existing identities, saved reports, records and manual changes. Creating a
new Space from a published template and applying one to existing work are distinct operations.

## Operational registers and Board

Risks, stakeholders, issues, assumptions, decisions, changes, deliverables and costs live as
typed records in ordinary Data Spaces. Link admitted resources through the actual Graph and
native references. A register template never creates a Workflow for every record merely to
represent a project link. Unknown amounts and assessments remain unknown. Currency, units,
contribution policies and commitments need explicit financial reporting configuration.

Board is the proposed project resource hub: cards reference actual Surfaces, registers and saved
views. Flow opens steps; Reports shows captured indicators; Board opens resources. Adding a card
can create from a template or link an existing resource. Removing a reference must preserve its
target. Template definitions do not implement that Board; the Core owns its native integration.

## Growth and publication

Keep each template in its own directory, with a stable id, independent version, original native
artifact, useful description, instructions and licence. Collections curate exact identities. Builds
reject unindexed sources, duplicate identities, traversal and mismatched listing provenance.
Published versions are immutable. Revisions use a new semantic version and retain source history.
Market acceptance, authorization and installed behavior are verified separately from repository CI.
