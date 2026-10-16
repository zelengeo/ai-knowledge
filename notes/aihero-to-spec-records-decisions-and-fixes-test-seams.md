---
title: /to-spec records already-made decisions without interviewing, agrees the test seams before writing, and is only worth running when the build spans more than one session
type: technique
status: inbox
evidence: T1
sources:
  - https://www.aihero.dev/skills-to-spec
  - https://github.com/mattpocock/skills
tags: [aihero, pocock-skills, spec, planning, issue-tracker]
applies_to: [mattpocock-skills@1.3]
added: 2026-10-16
last_verified: 2026-10-16
verified_by: agent
---

`/to-spec` (formerly `/to-prd`) synthesises the conversation, codebase, `GLOSSARY.md`, and ADRs into one spec issue on the configured tracker. It asks no new questions; a spec stating something you never decided is a defect. Before prose it sketches the seams where the feature will be tested and checks them with you, preferring existing seams and ideally one. `tdd` later tests only at those seams and `code-review` reviews against this document. Per-skill detail belongs in [pocock-skill-to-spec](pocock-skill-to-spec.md).

## When to use

- Decided, and the work spans several sessions. Then `/to-tickets` in the same window.
- A cleared `wayfinder` map: `/to-spec #<map_issue>`.
- Skip it when the work fits one context window: go to `/implement`. The extra synthesis step only adds drift there.

## Procedure

1. Run `setup-matt-pocock-skills` once per repo so the tracker and label vocabulary exist. Local markdown under `.scratch/` is a valid tracker.
2. In the grilling conversation, type `/to-spec`. Read the proposed seams and push back; this is the cheapest place to catch a wrong one.
3. Read the out-of-scope section; refused items are the most useful lines.
4. Run `/to-tickets` without clearing or compacting. A large spec fetched back from a tracker issue truncates, and there is no local copy.
5. After the tickets exist, remove `ready-for-agent` from the parent spec or exclude it in any AFK agent's prompt; polling agents try to build the whole spec in one run.
6. Treat the spec as disposable after shipping. Lasting decisions go to `GLOSSARY.md` and ADRs, not to an edited spec.

## Evidence

Vendor docs page. Documented limitations: the template leans on user stories and fits refactors and module-boundary work badly; it does not search the tracker for overlapping work and does not link the ADRs it follows; nothing keeps the spec in sync once implementation starts. The `ready-for-agent` collision with AFK pollers is called the most-reported problem. All are statements of design and user reports, not measurements.

## Open questions

- This repo uses the same five triage labels; confirm the daily job's `ready-for-agent` query excludes parent specs.
- Does the seam step have any effect on a repo like this one where "tests" are frontmatter and link checks?
