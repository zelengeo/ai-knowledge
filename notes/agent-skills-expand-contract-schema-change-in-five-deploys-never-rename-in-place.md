---
title: deprecation-and-migration says never change a column in place; a rename is five independently deployable steps (add nullable column, dual-write, batched backfill, switch reads, stop writing then drop in a separate later deploy), every migration has a tested down path, and destructive steps ship alone
type: technique
status: inbox
evidence: T1
sources:
  - https://github.com/addyosmani/agent-skills/blob/main/skills/deprecation-and-migration/SKILL.md
tags: [agent-skills, database, migrations, expand-contract, deploy, rollback]
applies_to: [agent-skills@0.6.13]
added: 2026-10-24
last_verified: 2026-10-24
verified_by: agent
---

A schema change is the one migration a deploy revert cannot undo. The failure mode the skill names is coupling the schema change to the code change: during the rollout window old and new code run together, and one of them queries a column that no longer exists. The fix is additive phases in which old and new code are both valid at every step, with the destructive step last and alone.

## When to use

- Renaming, retyping or dropping a column or table on a system with zero-downtime deploys, or any deploy where two code versions overlap.
- Reviewing an agent-written migration: a rename in place or an add-and-drop in one migration is a red flag in the skill.

## Procedure

Worked example, renaming `name` to `full_name`:

1. Expand: add `full_name` nullable. Deploy. Old code ignores it.
2. Dual-write: the application writes both columns on every insert and update. Deploy.
3. Backfill: copy `name` to `full_name` for existing rows in throttled batches, off the hot path; a single UPDATE over millions of rows locks the table.
4. Switch reads: point the application at `full_name`, keep writing both. Deploy and bake.
5. Contract: stop writing `name`; then, in a separate later deploy, drop the column.

Each step is independently deployable and reversible: if step 4 misbehaves, roll the code back and `full_name` is still being populated. Treat each phase as a thin vertical slice.

Rules: additive first (new nullable column, table or index is safe in any deploy), destructive last and alone (drops and renames get their own deploy after no code references the old shape); every migration has a `down` written and run before merge; build large indexes without blocking writes (Postgres `CREATE INDEX CONCURRENTLY`); decouple risky cutovers from code with a feature flag.

Verification the skill requires after a schema migration: the change shipped as expand, backfill, contract rather than one in-place edit; old and new code both valid against the schema at every deploy step; each migration has a tested down path and backfills ran in throttled batches; destructive steps shipped in their own deploy.

The surrounding skill (code as liability, Hyrum's Law making removal hard, the Churn Rule that the owner of the thing being retired does the migrating, strangler and adapter patterns, zombie-code signs such as no commits in six months with active consumers) is generic and not recorded here.

## Evidence

Read from the skill. Expand/contract is established practice; the skill adds no measurement and cites no source. The agent-specific value is the two rationalizations it rebuts: "just rename the column, it's one line" and "I'll add the column and drop the old one in the same migration".

## Open questions

- The procedure assumes the application controls all writers; external writers to the same table need the dual-write enforced at the database (trigger or view), which the skill does not cover.
